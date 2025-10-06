defineRouteMeta({
  openAPI: {
    description: 'Verify the site token',
    responses: {
      200: {
        description: 'The site token is valid',
      },
      default: {
        description: 'The site token is invalid',
      },
    },
  },
})

export default eventHandler((event) => {
  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
  const config = useRuntimeConfig(event)
  
  console.log('🔍 [verify.ts] Request received')
  console.log('🔍 [verify.ts] Authorization header:', getHeader(event, 'Authorization'))
  console.log('🔍 [verify.ts] Extracted token:', token)
  console.log('🔍 [verify.ts] Expected site token:', config.siteToken)
  console.log('🔍 [verify.ts] Token match:', token === config.siteToken)
  console.log('🔍 [verify.ts] Request path:', event.path)
  console.log('🔍 [verify.ts] Request method:', event.method)
  
  return {
    name: 'Sink',
    url: 'https://sink.cool',
  }
})
