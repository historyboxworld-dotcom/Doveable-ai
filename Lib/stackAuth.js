import { Stack } from 'stack-auth'

let stack = null

// Initialize only on client side
if (typeof window !== 'undefined') {
  stack = new Stack({
    project_id: '7521f17c-fa2b-4843-b9a1-ec618890c529',
    publishable_client_key: 'pck_8baysnfzjpvx8ztdsd98m0xtz9kq8wz9f0qq077dfszp0',
  })
}

export { stack }
