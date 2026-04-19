import { expect, test } from "@playwright/test";

/** Unique per run to avoid duplicate-email signup failures when re-running. */
const stamp = Date.now();

/** Use a public-looking domain; some providers reject invented TLDs like *.test.local. */
const ADMIN_EMAIL = "divas.admin.e2e@example.com";
const USER_EMAIL = `divas.user.e2e.${stamp}@example.com`;
const PASS_USER = "TestUserPass123!";
const PASS_ADMIN = "TestAdminPass456!";

async function loginForm(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/login");
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await Promise.all([
    page.waitForURL(/\/app\/listing|\/admin/, { timeout: 45_000 }),
    page.getByRole("button", { name: "Entrar" }).click(),
  ]);
}

async function signupOrLogin(
  page: import("@playwright/test").Page,
  name: string,
  email: string,
  password: string,
) {
  await page.goto("/signup");
  await page.getByLabel("Nome completo").fill(name);
  await page.getByLabel("E-mail").fill(email);
  const pwdInputs = page.locator('form input[type="password"]');
  await pwdInputs.nth(0).fill(password);
  await page.locator("#su-confirm").fill(password);
  await page.getByRole("button", { name: "Cadastrar" }).click();
  try {
    await page.waitForURL(/\/app\/listing|\/admin/, { timeout: 45_000 });
  } catch {
    await loginForm(page, email, password);
  }
  await expect(page).toHaveURL(/\/app\/listing|\/admin/);
}

test.describe("Firebase auth + admin RBAC", () => {
  test("regular user vs bootstrap admin", async ({ page }) => {
    test.setTimeout(180_000);

    // 1) Normal user — not in bootstrap list → role user
    await signupOrLogin(page, "E2E Standard User", USER_EMAIL, PASS_USER);
    await expect(page).toHaveURL(/\/app\/listing/);

    await page.getByRole("button", { name: "Sair" }).click();
    await page.waitForURL(/\//, { timeout: 15_000 });

    // 2) Admin candidate — email listed in VITE_BOOTSTRAP_ADMIN_EMAILS → lands on /admin
    await signupOrLogin(page, "E2E Bootstrap Admin", ADMIN_EMAIL, PASS_ADMIN);
    await expect(page).toHaveURL(/\/admin/);

    await expect(page.getByText("Divas Admin")).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Usuários" })).toBeVisible();

    await page.getByRole("button", { name: "Sair" }).click();
    await page.waitForURL(/\//, { timeout: 15_000 });

    // 3) Login as normal user — /admin must redirect away (non-admin)
    await loginForm(page, USER_EMAIL, PASS_USER);
    await page.waitForURL(/\/app\/listing/, { timeout: 25_000 });

    await page.goto("/admin");
    await page.waitForURL(/\/app\/listing/, { timeout: 15_000 });
    await expect(page).not.toHaveURL(/\/admin/);

    await page.getByRole("button", { name: "Sair" }).click();

    // 4) Login as admin — /admin works
    await loginForm(page, ADMIN_EMAIL, PASS_ADMIN);
    await page.waitForURL(/\/admin/, { timeout: 25_000 });

    await expect(page.getByText("Divas Admin")).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "Publicações" })).toBeVisible();
  });
});
