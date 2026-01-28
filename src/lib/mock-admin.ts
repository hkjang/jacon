
export type AdminRole = 'System Admin' | 'Security Admin' | 'Org Admin' | 'Audit Admin' | 'Platform Admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'Active' | 'Locked' | 'Pending';
  lastLogin: string;
  department: string;
}

export interface SystemSetting {
    key: string;
    label: string;
    value: boolean | string | number;
    category: 'Security' | 'System' | 'Network'
    description?: string;
}

export const MOCK_ADMIN_USERS: AdminUser[] = [
    { id: 'admin-1', name: '김철수 (시스템 팀장)', email: 'kim.cs@jacon.io', role: 'System Admin', status: 'Active', lastLogin: '2024-05-20 09:12', department: '인프라 운영팀' },
    { id: 'admin-2', name: '이영희 (보안 담당)', email: 'lee.yh@jacon.io', role: 'Security Admin', status: 'Active', lastLogin: '2024-05-20 08:30', department: '정보보호팀' },
    { id: 'admin-3', name: '박민수 (감사)', email: 'park.ms@jacon.io', role: 'Audit Admin', status: 'Active', lastLogin: '2024-05-19 14:22', department: '감사팀' },
    { id: 'admin-4', name: '최지훈 (외부 협력)', email: 'choi.jh@partner.io', role: 'Org Admin', status: 'Locked', lastLogin: '2024-04-30 01:00', department: '외부 파트너' },
    { id: 'admin-5', name: '정수진 (플랫폼 리드)', email: 'jung.sj@jacon.io', role: 'Platform Admin', status: 'Active', lastLogin: '2024-05-20 10:45', department: '플랫폼 엔지니어링' },
    { id: 'admin-6', name: '강동원 (데브옵스)', email: 'kang.dw@jacon.io', role: 'System Admin', status: 'Pending', lastLogin: '-', department: '데브옵스 1팀' },
    { id: 'admin-7', name: '윤서연 (보안)', email: 'yoon.sy@jacon.io', role: 'Security Admin', status: 'Active', lastLogin: '2024-05-18 17:50', department: '정보보호팀' },
    { id: 'admin-8', name: '한재석 (모니터링)', email: 'han.js@jacon.io', role: 'System Admin', status: 'Active', lastLogin: '2024-05-20 11:20', department: '인프라 관제' },
];

export const MOCK_SYSTEM_SETTINGS: SystemSetting[] = [
    { key: 'mfa_enforcement', label: '모든 관리자 MFA 강제', value: true, category: 'Security', description: '모든 관리자 계정 로그인 시 2단계 인증을 필수로 요구합니다.' },
    { key: 'session_timeout', label: '관리자 세션 타임아웃 (분)', value: 60, category: 'Security', description: '유휴 상태가 지속될 경우 세션을 자동으로 종료하는 시간입니다.' },
    { key: 'maintenance_mode', label: '유지보수 모드 (읽기 전용)', value: false, category: 'System', description: '시스템 업그레이드 중 전체 플랫폼을 읽기 전용 상태로 전환합니다.' },
    { key: 'allow_public_endpoints', label: '공용 엔드포인트 허용', value: false, category: 'Network', description: '인터넷에 노출된 퍼블릭 엔드포인트의 등록을 허용합니다.' },
    { key: 'max_login_attempts', label: '최대 로그인 실패 허용 횟수', value: 5, category: 'Security', description: '계정이 잠기기 전 허용되는 비밀번호 입력 실패 횟수입니다.' },
    { key: 'log_retention_days', label: '감사 로그 보관 기간 (일)', value: 365, category: 'System', description: '규정 준수를 위해 감사 로그를 보관하는 기간입니다.' },
    { key: 'allow_guest_invite', label: '게스트 사용자 초대 허용', value: true, category: 'Security', description: '프로젝트 관리자가 외부 게스트를 초대할 수 있는지 설정합니다.' },
];
