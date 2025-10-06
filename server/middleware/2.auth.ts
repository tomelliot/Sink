export default eventHandler((event) => {
  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')
  const config = useRuntimeConfig(event)
  
  console.log('🔐 [2.auth.ts] Auth middleware triggered')
  console.log('🔐 [2.auth.ts] Request path:', event.path)
  console.log('🔐 [2.auth.ts] Request method:', event.method)
  console.log('🔐 [2.auth.ts] Authorization header:', getHeader(event, 'Authorization'))
  console.log('🔐 [2.auth.ts] Extracted token:', token)
  console.log('🔐 [2.auth.ts] Token length:', token?.length || 0)
  console.log('🔐 [2.auth.ts] Is API path:', event.path.startsWith('/api/'))
  console.log('🔐 [2.auth.ts] Is internal API path:', event.path.startsWith('/api/_'))
  
  // Print all config key/value pairs
  console.log('🔐 [2.auth.ts] Full runtime config:')
  Object.entries(config).forEach(([key, value]) => {
    // Mask sensitive values but show their presence and length  
    console.log(`🔐 [2.auth.ts]   ${key}:`, value)
    
  })
  
  console.log('🔐 [2.auth.ts] Expected site token:', config.siteToken)
  console.log('🔐 [2.auth.ts] Token matches expected:', token === config.siteToken)
  
  const siteToken = event.context.cloudflare.env.SECRET_FROM_STORE.get('SITE_TOKEN')
  console.log('🔐 [2.auth.ts] siteToken:', siteToken)
  console.log('🔐 [2.auth.ts] siteToken matches expected:', token === siteToken)
  
  // Check if this is an API endpoint that requires authentication
  if (event.path.startsWith('/api/') && !event.path.startsWith('/api/_')) {
    console.log('🔐 [2.auth.ts] API endpoint detected, checking authentication')
    
    if (token !== siteToken) {
      console.log('❌ [2.auth.ts] Authentication failed - token mismatch')
      console.log('❌ [2.auth.ts] Received token:', token)
      console.log('❌ [2.auth.ts] Expected token:', siteToken)
      throw createError({
        status: 401,
        statusText: 'Unauthorized',
      })
    }
    
    console.log('✅ [2.auth.ts] API authentication successful')
  }
  
  // Check token length if token is provided
  if (token && token.length < 8) {
    console.log('❌ [2.auth.ts] Token too short:', token.length, 'characters')
    throw createError({
      status: 401,
      statusText: 'Token is too short',
    })
  }
  
  console.log('✅ [2.auth.ts] Auth middleware passed')
})
