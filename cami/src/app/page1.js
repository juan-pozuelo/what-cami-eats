'use client';

import { useState, useEffect } from 'react';
import ingredientsData from './ingredients.json';

export default function Home() {
  const [ingredient, setIngredient] = useState('');
  const [result, setResult] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const lower = ingredient.toLowerCase().trim();

    // Find ingredient in JSON data (case-insensitive match)
    const found = ingredientsData.find(
      (item) => item.name.toLowerCase() === lower
    );

    if (found) {
      setResult(found);
    } else {
      // Fallback response
      setResult({
        name: ingredient,
        emoji: '🤔',
        comment: `"${ingredient}" is a bit of a mystery. Check the label and trust your gut.`,
        healthiness: 'Unknown',
        sustainability: 'Unknown',
      });
    }

    setFadeIn(false); // reset animation
  };

  // Trigger fade-in animation on result change
  useEffect(() => {
    if (result) {
      const timeout = setTimeout(() => setFadeIn(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [result]);

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Is this ingredient ✨ Cami Approved?</h1>
        <p style={styles.subtitle}>
          A quick vibe-check on ingredients — sustainable, healthy, and Italian-nonna friendly.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="e.g. Eggplant"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Check Ingredient
          </button>
        </form>

        {result && (
          <div
            style={{
              ...styles.resultBox,
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            <h2 style={styles.emoji}>
              {result.emoji} {result.name.charAt(0).toUpperCase() + result.name.slice(1)}
            </h2>
            <p style={styles.comment}>{result.comment}</p>
            <p style={styles.info}>
              <strong>Healthiness:</strong> {result.healthiness}
            </p>
            <p style={styles.info}>
              <strong>Sustainability:</strong> {result.sustainability}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      `}</style>
    </main>
  );
}

const styles = {
  main: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#fdf6f0',
    minHeight: '100vh',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.04)',
    border: '1px solid #eee',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#3b3028',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#7b9e89',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.9rem 1rem',
    fontSize: '1rem',
    borderRadius: '12px',
    border: '1px solid #ddd',
    outlineColor: '#c1440e',
    backgroundColor: '#fffdfb',
    color: '#3b3028',
  },
  button: {
    backgroundColor: '#c1440e',
    color: '#fff',
    fontWeight: '500',
    fontSize: '1rem',
    padding: '0.9rem',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  resultBox: {
    marginTop: '2rem',
    backgroundColor: '#f6f1ea',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #c1440e',
    color: '#3b3028',
  },
  emoji: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  comment: {
    marginTop: '0.5rem',
    fontSize: '1rem',
    fontWeight: '500',
  },
  info: {
    marginTop: '0.8rem',
    fontSize: '0.9rem',
    color: '#7b9e89',
  },
};
