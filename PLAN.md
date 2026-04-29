# 🚀 Arabic Communication App – Product Vision & Architecture

## 📌 Tổng quan dự án
Ứng dụng đa nền tảng (Web & Mobile) giúp phá bỏ rào cản ngôn ngữ và văn hóa khi giao tiếp với người Ả Rập. 
Sản phẩm không chỉ là một **Từ điển (Dictionary)**, mà còn hoạt động như một **Sổ tay giao tiếp (Phrasebook)**, một **Người phiên dịch trực tiếp (Conversation Mode)**, và một **Hướng dẫn viên văn hóa (Culture Guide)**.

**Mục tiêu chính:** 
- Giao diện hiện đại, tương tác mượt mà.
- Thực tiễn, tiện lợi khi đi du lịch, công tác.
- Hỗ trợ tốt trong môi trường Offline.

---

## 🛠 Kiến trúc & Tech Stack (Chi tiết)

Dự án sẽ được xây dựng trên mô hình **Monorepo** để chia sẻ tối đa logic (như Database config, TypeScript types, API utils) giữa Web và Mobile, giúp tiết kiệm thời gian và dễ bảo trì đồng bộ.

### 1. Frontend Web (React 19)
- **Core Framework**: **React 19** (có thể setup qua Vite cho SPA hoặc Next.js 15). Chốt sử dụng React 19 để tận dụng các hook/tính năng mới như `use`, `useActionState`, Form Actions giúp tối ưu rendering, clean code và quản lý state form tốt hơn.
- **Ngôn ngữ**: TypeScript (Strict mode) giúp quản lý code chặt chẽ cho dự án lớn.
- **Styling**: Tailwind CSS v4 + Framer Motion (để tạo các micro-animations, hiệu ứng chuyển trang mượt mà như native app).
- **State Management**: 
  - **Zustand**: Quản lý Global State cục bộ nhẹ nhàng (thay thế Redux).
  - **TanStack Query (React Query)**: Fetching API và đặc biệt hữu ích trong việc làm Offline Caching cho từ vựng.

### 2. Frontend Mobile (React Native)
- **Core Framework**: React Native với **Expo** (Ecosystem mạnh mẽ, code 1 lần build được cho cả iOS & Android dễ dàng).
- **Navigation**: Expo Router (Routing dựa trên file-system, tương đồng với cách Next.js làm trên web).
- **Styling**: NativeWind (cho phép viết Tailwind CSS trực tiếp trên mobile app).

### 3. Backend, Database & Cloud Services
- **Database**: Firebase Firestore (NoSQL, realtime). Đây là lựa chọn hoàn hảo cho từ điển vì hỗ trợ native **Offline-first** cực mạnh, data tải một lần có thể xem khi không có mạng.
- **Authentication**: Firebase Auth (Hỗ trợ đăng nhập linh hoạt Google/Apple/Email).
- **Storage**: Firebase Cloud Storage (Dùng để lưu các file Audio phát âm từ vựng).
- **Cloud Functions**: Firebase Cloud Functions (Dùng để viết một số logic backend bảo mật nếu cần tương tác với API AI/Voice).

### 4. AI & Voice Services (Cho tính năng dịch giọng nói)
- **Speech-to-Text / Text-to-Speech**: **Google Cloud Speech API** hoặc **OpenAI Whisper API** để nhận diện và phát âm tiếng Ả Rập chuẩn xác, tự nhiên nhất.

### 5. Monorepo Management
- Sử dụng **Turborepo** cấu trúc dự án:
  - `/apps/web` (Web app React 19)
  - `/apps/mobile` (Mobile app Expo)
  - `/packages/shared` (Chứa Types, Firebase config, Utils dùng chung)

---

## 🧭 Lộ trình phát triển (Development Roadmap)

Duy trì nhịp độ Sprint kéo dài từ 1–2 tuần. Nguyên tắc: Cuối mỗi Sprint đều có output chạy được.

### 🧩 Giai đoạn 1: Móng vững (Sprint 1-2)
*Tập trung vào hạ tầng chung và tính năng tra cứu cốt lõi.*
- **Sprint 1 - Foundation Setup**: 
  - Khởi tạo monorepo Turborepo.
  - Setup React 19 (Web), Expo (Mobile) và kết nối Firebase (Firestore, Auth).
- **Sprint 2 - Dictionary MVP**: 
  - UI tìm kiếm từ vựng.
  - Hiển thị kết quả: Anh - Việt - Ả Rập và Phiên âm (Phonetic).
  - Lưu lịch sử tìm kiếm.

### 🧩 Giai đoạn 2: Sẵn sàng thực chiến (Sprint 3-4)
*Tập trung vào các tính năng dùng ngay khi đi lại, giao tiếp thực tế.*
- **Sprint 3 - Phrasebook**: 
  - Danh sách câu giao tiếp chia theo chủ đề: Chào hỏi, Nhà hàng, Mua sắm, Khẩn cấp, Di chuyển.
  - Tích hợp Audio phát âm từng câu.
- **Sprint 4 - Conversation Mode (Core Feature)**: 
  - Chế độ giao tiếp trực tiếp (Chọn role: Tôi nói → Ả Rập nghe, hoặc ngược lại).
  - UI tối ưu: Chữ lớn, mỗi câu một màn hình, điều hướng bằng Swipe (vuốt), có nút play audio to rõ.

### 🧩 Giai đoạn 3: Trải nghiệm & Văn hóa (Sprint 5-6)
*Làm phong phú chiều sâu ứng dụng và cá nhân hóa trải nghiệm.*
- **Sprint 5 - Culture Guide**: 
  - Cẩm nang văn hóa chia theo quốc gia (UAE, Saudi Arabia, Qatar).
  - Nội dung: Quy tắc ứng xử (Dos & Don'ts), văn hóa ăn uống, tôn giáo.
- **Sprint 6 - UX & Personalization**: 
  - Tính năng "Lưu từ vựng yêu thích".
  - Refine toàn bộ UI/UX, thêm Dark mode.

### 🧩 Giai đoạn 4: Trợ lý AI & Tối ưu hóa (Sprint 7-8)
*Nâng cấp thành phiên dịch viên thông minh và chuẩn bị phát hành.*
- **Sprint 7 - Voice & AI**: 
  - Tích hợp AI Voice pipeline: Người dùng nói → Nhận diện text → Dịch thuật → Phát âm.
- **Sprint 8 - Offline & Optimization**: 
  - Đóng gói Database (Tải các gói Phrasebook offline) để dùng trên máy bay/sa mạc.
  - Tối ưu hiệu năng, caching, sẵn sàng Launch Production.

---

## 🗄️ Cấu trúc Database dự kiến (Firestore)

**Collection: `words` (Từ vựng & Cụm từ)**
```json
{
  "id": "word_123",
  "word_en": "hello",
  "translations": {
    "vi": "xin chào",
    "ar": "مرحبا"
  },
  "phonetic": "marhaban",
  "examples": [
    "hello, how are you?"
  ],
  "audio_url": "gs://...",
  "category": "greeting",
  "is_phrase": false,
  "created_at": "timestamp"
}
```