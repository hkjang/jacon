export interface PolicyResult {
  allowed: boolean;
  violations: string[];
  warnings: string[];
}

export const checkPolicy = async (manifest: string): Promise<PolicyResult> => {
  // Simulate async policy check
  await new Promise(resolve => setTimeout(resolve, 600));

  const violations: string[] = [];
  const warnings: string[] = [];

  if (manifest.includes('privileged: true')) {
     violations.push('Disallowed: Privileged containers are strictly prohibited in this environment (Policy: SEC-001).');
  }

  if (!manifest.includes('resources:')) {
     warnings.push('Warning: Resource limits are missing. This may affect cluster stability (Policy: OPS-003).');
  }

  if (manifest.includes('image: latest')) {
     warnings.push('Warning: Using "latest" tag is not recommended for production (Policy: OPS-005).');
  }

  return {
    allowed: violations.length === 0,
    violations,
    warnings
  };
};
