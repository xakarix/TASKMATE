import supabase from './supabase';

// Rejestracja użytkownika
export const signUp = async (email, password, username) => {
    try {
      // Rejestracja użytkownika
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) throw error;
  
  
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

// Logowanie użytkownika
export async function signIn(email, password) {
    const { session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Error signing in:', error.message);
        throw error;
    }
    return session;
}

// Wylogowanie użytkownika
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error('Error signing out:', error.message);
        throw error;
    }
}

// Pobranie aktualnego użytkownika
export async function getCurrentUser() {
    const user = supabase.auth.user();
    if (!user) {
        console.error('No current user found.');
        return null;
    }
    return user;
}
