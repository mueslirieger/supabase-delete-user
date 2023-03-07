import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Check if the request is authenticated here
  // for example: store the user's authentication information in cookies, supabase provides a very nice tutorial for that
  // https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

  if (req.method === 'GET') {
    // get query parameters after first access check
    const { user } = req.query;

    // Check if the user id is valid
    if (typeof user !== 'string' /* && e.g. doesnt match pattern of user id */) {
      console.error('Incorrect user id');
      return res.status(400).json({ error: 'Invalid user id' });
    }

    // Create a new supabase client with the service_role key
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data, error } = await supabase.auth.admin.deleteUser(user);

    // Error handling
    if (error) {
      console.error(error);
      // Only for debugging, you will probably want to obscure implementation details from users and provide a more vague error message
      return res.status(500).json({ error: `Error from supabase: ${error.name}: ${error.message}` });
    }

    if (!data.user) {
      return res.status(500).json({ error: `Error from supabase: ` });
    }

    // Success
    console.log('Data: ', data);
    return res.status(200).json({ user: data.user.id });
  }

  return res.status(400).json({ error: 'some error message' });
}
