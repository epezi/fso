const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {

    const heading = page.getByRole('heading', { name: 'Login' })
    await expect(heading).toBeVisible()

    const usernameInput = page.getByTestId('username')
    await expect(usernameInput).toBeVisible()

    const passwordInput = page.getByTestId('password')
    await expect(passwordInput).toBeVisible()

    const loginButton = page.getByRole('button', { name: 'login' })
    await expect(loginButton).toBeVisible()

  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('salainen')

        await page.getByRole('button', { name: 'login' }).click() 
  
        await expect(page.getByText('mluukkai logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByRole('button', { name: 'login' }).click() 
        
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('julkinen')

        await page.getByRole('button', { name: 'login' }).click() 
  
        const message = page.getByText('wrong username or password')
        await expect(message).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await loginWith(page,'mluukkai','salainen')
        await createBlog(page, 'testi blogi', 'testi', 'testi.fi')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'uusi blogi', 'testaaja', 'testi.com')

      const newBlog = page.getByText('uusi blogi testaaja')
      await expect(newBlog).toBeVisible()

    })

    test('a blog can be liked', async ({ page }) => {
      const blogElement = page.getByText('testi blogi testi')
      await expect(blogElement).toBeVisible()

      await blogElement.getByRole('button', { name: 'view'}).click()
      await page.getByRole('button', { name: 'like'}).click()

      const likes = page.getByText('likes 1')
      await expect(likes).toBeVisible()

    })

    test('a blog can be deleted', async ({ page }) => {
      const blogElement = page.getByText('testi blogi testi')
      await expect(blogElement).toBeVisible()

      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Remove blog')
        await dialog.accept()
      })

      await blogElement.getByRole('button', { name: 'view'}).click()
      await page.getByRole('button', { name: 'delete'}).click()

      const blog = page.getByText('testi blogi testi')
      await expect(blog).toHaveCount(0)

    })
    test('only blogs creater can see delete', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          name: 'Eemeli Ristolainen',
          username: 'eemeli',
          password: 'salainen'
        }
      })

      await page.getByRole('button', { name: 'logout'}).click()

      await loginWith(page, 'eemeli', 'salainen')

      const blogElement = page.getByText('testi blogi testi')
      await expect(blogElement).toBeVisible()

      await blogElement.getByRole('button', { name: 'view'}).click()
      const button = page.getByRole('button', { name: 'delete'})
      await expect(button).toHaveCount(0)

    })

    test('blogs are in DSC order', async ({ page, request }) => {
      await request.post('/api/blogs', {
        data: {     
            title: "testi keski",
            author: "keski",
            url: "keski.fi",
            likes: 3
        }
      })
      await request.post('/api/blogs', {
        data: {     
            title: "testi pieni",
            author: "pieni",
            url: "pieni.fi",
            likes: 1
        }
      })
      await request.post('/api/blogs', {
        data: {     
            title: "testi iso",
            author: "iso",
            url: "iso.fi",
            likes: 65
        }
      })

    const viewButtons = page.getByRole('button', { name: 'view' }).all()
    let lastLikes = 0
    for(let i = 0; i < 3; i++) {
      await viewButtons[i].click()
      const likesText = await page.locator('text=likes').innerText()
      const likes = parseInt(likesText.replace('likes ', ''), 10)

      expect(likes).toBeLessThanOrEqual(lastLikes)
      lastNum = likesNumber
      await page.getByRole('butto', { name: 'hide' }).click()
    }
    })
  })
})