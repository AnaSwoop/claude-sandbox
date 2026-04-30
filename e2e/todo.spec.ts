import { expect, test } from '@playwright/test'

test('add, toggle, and delete a todo', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'ToDo Sandbox' })).toBeVisible()

  await page.getByLabel('New todo').fill('write playwright spec')
  await page.getByRole('button', { name: 'Add' }).click()

  const item = page.getByTestId('todo-item').filter({ hasText: 'write playwright spec' })
  await expect(item).toBeVisible()

  await item.getByRole('checkbox').check()
  await expect(item.getByRole('checkbox')).toBeChecked()

  await item.getByRole('button', { name: /Delete/ }).click()
  await expect(item).toHaveCount(0)
})
