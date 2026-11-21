import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  deleteFulfillmentSetsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
  deleteRegionsWorkflow,
  deleteShippingOptionsWorkflow,
  deleteStockLocationsWorkflow,
  deleteTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { DEFAULT_REGION_STORE_POLICIES } from "../lib/region-store-policies"

/**
 * Prepares the store for the Indian market and removes the Medusa demo data
 * created by the starter's initial seed.
 *
 *   cd apps/backend && bunx medusa exec ./src/scripts/setup-india-market.ts
 *
 * Idempotent: every step checks current state first, so re-running is safe.
 * All mutations go through core-flows workflows so links, events and
 * inventory stay consistent. Deletions are soft deletes.
 *
 * Business values that are NOT decided yet are created as clearly labelled
 * placeholders (shipping rate, warehouse address, GST rates). Replace them in
 * Medusa Admin before launch.
 */

const DEMO_PRODUCT_HANDLES = ["t-shirt", "sweatshirt", "sweatpants", "shorts"]
const DEMO_CATEGORY_HANDLES = ["shirts", "sweatshirts", "pants", "merch"]
const DEMO_REGION_NAME = "Europe"
const DEMO_STOCK_LOCATION_NAME = "European Warehouse"

const INDIA_REGION_NAME = "India"
const INDIA_STOCK_LOCATION_NAME = "India Warehouse (placeholder address)"

export default async function setupIndiaMarket({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const taxModule = container.resolve(Modules.TAX)

  // --- Store currency -----------------------------------------------------
  const {
    data: [store],
  } = await query.graph({
    entity: "store",
    fields: ["id", "supported_currencies.currency_code"],
  })
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [{ currency_code: "inr", is_default: true }],
      },
    },
  })
  logger.info("Store default currency set to INR.")

  // --- India region -------------------------------------------------------
  const { data: existingIndia } = await query.graph({
    entity: "region",
    fields: ["id"],
    filters: { name: INDIA_REGION_NAME },
  })
  let indiaRegionId = existingIndia[0]?.id

  // Remove the demo region first: a country can only belong to one region.
  const { data: demoRegions } = await query.graph({
    entity: "region",
    fields: ["id"],
    filters: { name: DEMO_REGION_NAME },
  })
  if (demoRegions.length) {
    await deleteRegionsWorkflow(container).run({
      input: { ids: demoRegions.map((r) => r.id) },
    })
    logger.info("Deleted demo region Europe.")
  }

  if (!indiaRegionId) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: INDIA_REGION_NAME,
            currency_code: "inr",
            countries: ["in"],
            automatic_taxes: true,
            // Replace with Razorpay once its provider is installed.
            payment_providers: ["pp_system_default"],
            metadata: {
              ...DEFAULT_REGION_STORE_POLICIES,
              shipping_rate: 0,
              policies_are_placeholders: true,
            },
          },
        ],
      },
    })
    indiaRegionId = result[0].id
    logger.info("Created India region (INR).")
  }

  // --- Tax regions --------------------------------------------------------
  const demoTaxRegions = await taxModule.listTaxRegions({
    country_code: ["dk", "fr", "de", "it", "es", "se", "gb"],
  })
  if (demoTaxRegions.length) {
    await deleteTaxRegionsWorkflow(container).run({
      input: { ids: demoTaxRegions.map((t) => t.id) },
    })
    logger.info(`Deleted ${demoTaxRegions.length} demo tax regions.`)
  }
  const indiaTax = await taxModule.listTaxRegions({ country_code: "in" })
  if (!indiaTax.length) {
    // No default rate on purpose: GST rates depend on HSN codes and must be
    // confirmed by the business. Configure in Admin > Settings > Tax Regions.
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "in", provider_id: "tp_system" }],
    })
    logger.info("Created India tax region (no GST rate set yet).")
  }

  // --- Demo products and categories --------------------------------------
  const { data: demoProducts } = await query.graph({
    entity: "product",
    fields: ["id"],
    filters: { handle: DEMO_PRODUCT_HANDLES },
  })
  if (demoProducts.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: demoProducts.map((p) => p.id) },
    })
    logger.info(`Deleted ${demoProducts.length} demo products.`)
  }
  const { data: demoCategories } = await query.graph({
    entity: "product_category",
    fields: ["id"],
    filters: { handle: DEMO_CATEGORY_HANDLES },
  })
  if (demoCategories.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: demoCategories.map((c) => c.id),
    })
    logger.info(`Deleted ${demoCategories.length} demo categories.`)
  }

  // --- Demo warehouse and shipping ---------------------------------------
  const { data: demoLocations } = await query.graph({
    entity: "stock_location",
    fields: [
      "id",
      "fulfillment_sets.id",
      "fulfillment_sets.service_zones.shipping_options.id",
    ],
    filters: { name: DEMO_STOCK_LOCATION_NAME },
  })
  for (const location of demoLocations) {
    const sets = location.fulfillment_sets ?? []
    const optionIds = sets.flatMap((s) =>
      (s?.service_zones ?? []).flatMap((z) =>
        (z?.shipping_options ?? []).map((o) => o!.id)
      )
    )
    if (optionIds.length) {
      await deleteShippingOptionsWorkflow(container).run({
        input: { ids: optionIds },
      })
    }
    const setIds = sets.map((s) => s!.id)
    if (setIds.length) {
      await deleteFulfillmentSetsWorkflow(container).run({
        input: { ids: setIds },
      })
    }
    await deleteStockLocationsWorkflow(container).run({
      input: { ids: [location.id] },
    })
    logger.info("Deleted demo European Warehouse, its shipping options and fulfillment set.")
  }

  // --- India warehouse and shipping --------------------------------------
  const { data: indiaLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
    filters: { name: INDIA_STOCK_LOCATION_NAME },
  })
  if (indiaLocations.length) {
    logger.info("India warehouse already exists. Done.")
    return
  }

  const {
    result: [stockLocation],
  } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: INDIA_STOCK_LOCATION_NAME,
          address: { address_1: "", city: "", country_code: "IN" },
        },
      ],
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
    name: "India delivery",
    type: "shipping",
    service_zones: [
      {
        name: "India",
        geo_zones: [{ country_code: "in", type: "country" }],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping (rate to be confirmed)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfiles[0].id,
        type: {
          label: "Standard",
          description: "Placeholder. Set the real rate and delivery time in Admin.",
          code: "standard",
        },
        prices: [
          { currency_code: "inr", amount: 0 },
          { region_id: indiaRegionId, amount: 0 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  })

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
    filters: { name: "Default Sales Channel" },
  })
  if (salesChannels.length) {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocation.id, add: [salesChannels[0].id] },
    })
  }

  logger.info("Created India warehouse, fulfillment set and placeholder shipping option.")
}
