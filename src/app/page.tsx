export default function Home() {
  return (
    <div className="container">
      <main style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-hover))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Jacon
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '2rem' }}>
          Docker & Kubernetes 통합 운영 플랫폼
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
            시작하기
          </button>
        </div>
      </main>
    </div>
  );
}
