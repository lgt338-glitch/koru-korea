/* === KORU Korea — Main JS === */

// 모바일 메뉴 토글
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navMenu.classList.remove('open'));
  });
}

// 제품 쇼케이스 썸네일 클릭
const thumbs = document.querySelectorAll('.thumb');
const showcaseMain = document.getElementById('showcaseMain');
thumbs.forEach(t => {
  t.addEventListener('click', () => {
    thumbs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    if (showcaseMain) {
      showcaseMain.style.opacity = '0';
      setTimeout(() => {
        showcaseMain.src = t.dataset.img;
        showcaseMain.style.opacity = '1';
      }, 200);
    }
  });
});

// 히어로 미니 썸네일 클릭
const miniThumbs = document.querySelectorAll('.mini-thumb');
const heroMain = document.getElementById('heroMain');
miniThumbs.forEach(t => {
  t.addEventListener('click', () => {
    miniThumbs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    if (heroMain) {
      heroMain.style.opacity = '0';
      setTimeout(() => {
        heroMain.src = t.dataset.img;
        heroMain.style.opacity = '1';
      }, 200);
    }
  });
});

// 헤더 스크롤 효과
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (header) {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
});

// 문의 폼 제출
function submitInquiry(e) {
  e.preventDefault();

  const data = {
    company:   document.getElementById('company').value,
    bizNumber: document.getElementById('bizNumber').value,
    name:      document.getElementById('name').value,
    position:  document.getElementById('position').value,
    phone:     document.getElementById('phone').value,
    email:     document.getElementById('email').value,
    country:   document.getElementById('country').value,
    qty:       document.getElementById('qty').value,
    channel:   document.getElementById('channel').value,
    message:   document.getElementById('message').value,
    submittedAt: new Date().toLocaleString('ko-KR')
  };

  // LocalStorage 저장 (관리자용 백업)
  const inquiries = JSON.parse(localStorage.getItem('koru_inquiries') || '[]');
  inquiries.push(data);
  localStorage.setItem('koru_inquiries', JSON.stringify(inquiries));

  // 이메일 본문 생성
  const subject = `[KORU B2B] ${data.company} - ${data.country} ${data.qty} units`;
  const body = `
═══════════════════════════════
KORU ONE Korea — B2B 문의 / Inquiry
═══════════════════════════════

▶ 회사 정보 / Company
- 회사명 / Company:  ${data.company}
- 사업자번호 / Biz No:  ${data.bizNumber}
- 국가 / Country:  ${data.country}

▶ 담당자 / Contact
- 성함 / Name:  ${data.name}
- 직책 / Position:  ${data.position || '-'}
- 전화 / Phone:  ${data.phone}
- 이메일 / Email:  ${data.email}

▶ 주문 정보 / Order
- 예상 수량 / Qty:  ${data.qty}
- 채널 / Channel:  ${data.channel || '-'}

▶ 문의 내용 / Message
${data.message}

───────────────────────────────
접수 시간 / Submitted: ${data.submittedAt}
───────────────────────────────
  `.trim();

  // mailto 링크로 이메일 클라이언트 열기
  const mailto = `mailto:lgt778@naver.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;

  // 성공 모달 표시
  setTimeout(() => {
    document.getElementById('successModal').classList.add('show');
    document.getElementById('inquiryForm').reset();
  }, 500);
}

function closeModal() {
  document.getElementById('successModal').classList.remove('show');
}

// 관리자: localStorage 문의 목록 보기 (콘솔)
window.viewInquiries = function() {
  const data = JSON.parse(localStorage.getItem('koru_inquiries') || '[]');
  console.table(data);
  return data;
};

// 관리자: CSV 다운로드
window.exportInquiries = function() {
  const data = JSON.parse(localStorage.getItem('koru_inquiries') || '[]');
  if (data.length === 0) { alert('문의 내역 없음'); return; }
  const headers = Object.keys(data[0]);
  const csv = '﻿' + headers.join(',') + '\n' +
    data.map(row => headers.map(h => `"${(row[h]||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KORU_Inquiries_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
};
