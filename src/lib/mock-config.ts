export interface ConfigItem {
  id: string;
  name: string;
  namespace: string;
  type: 'ConfigMap' | 'Secret';
  keys: string[];
  age: string;
  data: Record<string, string>; // In real app, secrets would be redacted
}

export const MOCK_CONFIGS: ConfigItem[] = [
  { 
    id: '1', 
    name: 'app-settings', 
    namespace: 'backend', 
    type: 'ConfigMap', 
    keys: ['config.yaml', 'features.json'], 
    age: '5d',
    data: {
      'config.yaml': 'log_level: debug\nmax_connections: 100',
      'features.json': '{ "new_ui": true }'
    }
  },
  { 
    id: '2', 
    name: 'db-creds', 
    namespace: 'backend', 
    type: 'Secret', 
    keys: ['username', 'password'], 
    age: '12d',
    data: {
        'username': 'admin',
        'password': '***REDACTED***'
    }
  },
  { 
    id: '3', 
    name: 'nginx-conf', 
    namespace: 'frontend', 
    type: 'ConfigMap', 
    keys: ['nginx.conf'], 
    age: '2d',
    data: {
        'nginx.conf': 'server { listen 80; ... }'
    }
  },
  { 
    id: '4', 
    name: 'tls-cert', 
    namespace: 'ingress', 
    type: 'Secret', 
    keys: ['tls.crt', 'tls.key'], 
    age: '30d',
    data: {
        'tls.crt': '-----BEGIN CERTIFICATE-----...',
        'tls.key': '-----BEGIN PRIVATE KEY-----...'
    }
  }
];
