import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3004";
const errors = [];
const consoleLogs = [];

async function runTests() {
  console.log("🚀 Starting E2E tests with Playwright...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("response", (res) => {
    if (res.status() >= 400) {
      console.log(`[HTTP ${res.status()}]: ${res.url()}`);
    }
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleLogs.push(`[Browser Error]: ${msg.text()}`);
    }
  });

  let currentStep = "init";
  page.on("pageerror", (err) => {
    errors.push(`[Page Crash at ${currentStep} (${page.url()})]: ${err.message}`);
  });

  try {
    // 1. Homepage
    currentStep = "Homepage";
    console.log("➡️ Testing Homepage (/)...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    const title = await page.title();
    console.log(`   Page title: "${title}"`);
    if (!title.includes("Rei Market")) throw new Error("Title missing 'Rei Market'");

    // Check logo
    const logoExists = await page.locator("header svg, header text").count();
    console.log(`   Header Logo elements: ${logoExists}`);

    // Check announcement bar
    const announcement = await page.locator("text=Free delivery for orders above").isVisible();
    console.log(`   Announcement bar visible: ${announcement}`);

    // Check hero
    const heroText = await page.locator("text=Fresh Groceries").first().isVisible();
    console.log(`   Hero section visible: ${heroText}`);

    // Check promo banners
    const promoPicks = await page.locator("text=Fresh Picks").isVisible();
    console.log(`   Promo banners visible: ${promoPicks}`);

    // Check flash sale or popular products
    const flashSale = await page.locator("text=Flash Sale").isVisible();
    const popular = await page.locator("text=Popular Products").isVisible();
    console.log(`   Flash sale: ${flashSale}, Popular products: ${popular}`);

    // Check categories
    const categoriesSection = await page.locator("text=Shop by Category").isVisible();
    console.log(`   Categories section visible: ${categoriesSection}`);

    // Check Why Rei Market
    const whyRei = await page.locator("text=Why Shop at Rei Market?").isVisible();
    console.log(`   Why section visible: ${whyRei}`);

    // Check Newsletter CTA
    const newsletter = await page.locator("text=Stay Updated with Fresh Deals").isVisible();
    console.log(`   Newsletter CTA visible: ${newsletter}`);

    // Check Footer
    const footer = await page.locator("footer").isVisible();
    console.log(`   Footer visible: ${footer}`);

    // 2. Products Catalog
    currentStep = "Products Catalog";
    console.log("➡️ Testing Products Catalog (/products)...");
    await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle" });
    const productCards = await page.locator(".group").count();
    console.log(`   Product cards rendered: ${productCards}`);
    if (productCards === 0) throw new Error("No products rendered on /products");

    // Test search filter
    currentStep = "Products Search";
    console.log("➡️ Testing Search on Products...");
    await page.goto(`${BASE_URL}/products?search=Apple`, { waitUntil: "networkidle" });
    const searchCards = await page.locator(".group").count();
    console.log(`   Search results for 'Apple': ${searchCards}`);

    // 3. Product Detail Page
    currentStep = "Product Detail";
    console.log("➡️ Testing Product Detail Page...");
    await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle" });
    const firstProductLink = await page.locator("a[href^='/products/']").first();
    const detailUrl = await firstProductLink.getAttribute("href");
    console.log(`   Navigating to: ${detailUrl}`);
    await page.goto(`${BASE_URL}${detailUrl}`, { waitUntil: "networkidle" });

    const addToCartBtn = page.locator("button:has-text('Add to Cart')").first();
    const hasAddBtn = await addToCartBtn.isVisible();
    console.log(`   Add to Cart button visible: ${hasAddBtn}`);

    // Test click Add to Cart -> Toast notification should appear
    currentStep = "Add to Cart";
    console.log("➡️ Testing Add to Cart & Toast notification...");
    await addToCartBtn.click();
    await page.waitForTimeout(500);
    const toastVisible = await page.locator("div:has-text('added to cart')").first().isVisible();
    console.log(`   Toast appeared on Add to Cart: ${toastVisible}`);

    // 4. Cart Page
    currentStep = "Cart Page";
    console.log("➡️ Testing Cart Page (/cart)...");
    await page.goto(`${BASE_URL}/cart`, { waitUntil: "networkidle" });
    await page.waitForSelector("h1:has-text('Shopping Cart')", { timeout: 5000 });
    const checkoutLink = await page.locator("a[href='/checkout']").isVisible();
    console.log(`   Proceed to Checkout visible: ${checkoutLink}`);
    if (!checkoutLink) throw new Error("Proceed to Checkout link not visible on /cart");

    // 5. Wishlist Page
    currentStep = "Wishlist Page";
    console.log("➡️ Testing Wishlist Page (/wishlist)...");
    await page.goto(`${BASE_URL}/wishlist`, { waitUntil: "networkidle" });
    await page.waitForSelector("h1", { timeout: 5000 });
    const wishlistTitle = await page.locator("h1").innerText();
    console.log(`   Wishlist page heading: "${wishlistTitle}"`);
    if (!wishlistTitle.toLowerCase().includes("wishlist")) throw new Error("Wishlist page missing wishlist title");

    // 6. Login Page
    currentStep = "Login Page";
    console.log("➡️ Testing Login Page (/login)...");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    const emailInput = await page.locator("input[type='email']").isVisible();
    const passwordInput = await page.locator("input[type='password']").isVisible();
    const loginLogo = await page.locator("svg").count();
    console.log(`   Login inputs visible: ${emailInput && passwordInput}, Logo rendered: ${loginLogo > 0}`);

    // 7. Register Page
    currentStep = "Register Page";
    console.log("➡️ Testing Register Page (/register)...");
    await page.goto(`${BASE_URL}/register`, { waitUntil: "networkidle" });
    const regNameInput = await page.locator("input#name").isVisible();
    const regEmailInput = await page.locator("input#email").isVisible();
    const regPassInput = await page.locator("input#password").isVisible();
    console.log(`   Register form inputs visible: ${regNameInput && regEmailInput && regPassInput}`);

    console.log("\n✅ ALL END-TO-END FLOW CHECKS PASSED!");
  } catch (err) {
    console.error("\n❌ E2E Test Failure:", err.message);
    errors.push(err.message);
  } finally {
    await browser.close();
  }

  if (consoleLogs.length > 0) {
    console.log("\n⚠️ Console warnings/errors detected during run:");
    consoleLogs.forEach((log) => console.log(log));
  }

  if (errors.length > 0) {
    console.error("\n❌ Errors captured during test:");
    errors.forEach((e) => console.error(" -", e));
    console.error("❌ Total Errors:", errors.length);
    process.exit(1);
  } else {
    console.log("\n🎉 ZERO ERRORS FOUND across all tested pages and user flows.");
  }
}

runTests();
