// Static mock Supabase client for GitHub Pages deployment
// This avoids the need for environment variables

// Create a mock client with the same methods but static data
export const supabase = {
  // Auth methods that do nothing or return static data
  auth: {
    getSession: async () => ({
      data: { session: null },
      error: null
    }),
    getUser: async () => ({
      data: { user: null },
      error: null
    }),
    onAuthStateChange: (callback) => ({
      data: { subscription: { unsubscribe: () => {} } },
      error: null
    }),
    signIn: async () => ({
      data: null,
      error: { message: 'Authentication is not available in static mode' }
    }),
    signOut: async () => ({ error: null })
  },
  
  // Database methods that return static data
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        single: () => {
          console.log(`[Mock Supabase] select from ${table} where ${column} = ${value}`);
          return { data: null, error: null };
        },
        order: () => ({
          data: [],
          error: null
        }),
        in: () => ({
          order: () => ({
            data: [],
            error: null
          })
        })
      })
    }),
    insert: (rows) => ({
      select: () => ({
        single: () => ({
          data: { id: Date.now(), ...rows[0] },
          error: null
        })
      })
    }),
    update: (updateData) => ({
      eq: () => ({
        select: () => ({
          single: () => ({
            data: { id: 1, ...updateData },
            error: null
          })
        })
      })
    })
  }),
  
  storage: {
    from: (bucket) => ({
      upload: async (path, file) => ({
        data: { path },
        error: null
      }),
      getPublicUrl: (path) => ({
        data: { publicUrl: `https://example.com/${path}` }
      })
    })
  }
};
