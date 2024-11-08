module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"], // Next.js 기본 설정 확장
  rules: {
    '@typescript-eslint/no-unused-vars': 'off', // 사용되지 않는 변수 오류 무시
    '@typescript-eslint/no-explicit-any': 'off', // any 사용 경고 무시
  },
};
