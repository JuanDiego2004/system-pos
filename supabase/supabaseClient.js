import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://acxbeymnpkkexnplcwjf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjeGJleW1ucGtrZXhucGxjd2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwMTgxMjUsImV4cCI6MjAzNDU5NDEyNX0.caJW_MVEUSGzeUbjo9Wz_ocrqG6qxKzlWClP4DSEsIE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
