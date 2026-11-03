// ========================================
// 01. SUPABASE CONNECTION
// ========================================

// Replace these with your own Supabase details.
const SUPABASE_URL = "https://avkhbmvzqjfmgzexaemi.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Dxl7D0Ny9LB-jAoJxKkS0Q_1j-9tEcm";

// Create the Supabase connection.
const { createClient } = window.supabase;

window.supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("ALNS Supabase connection is ready!");