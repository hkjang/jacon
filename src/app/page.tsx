export default function Home() {
  return (
    <div className="container">
      <main style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-hover))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Jacon
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '2rem' }}>
          Unified Operations for Docker & Kubernetes
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--accent-primary)', 
            color: 'white', 
            border: 'none', 
            fontSize: '1rem', 
            cursor: 'pointer' 
          }}>
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}
