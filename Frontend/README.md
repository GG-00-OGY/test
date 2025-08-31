# 🏫 سامانه مدیریت مدرسه

یک سیستم کامل مدیریت مدرسه با فرانت‌اند React و بک‌اند Express.js و دیتابیس MySQL

## 🌟 ویژگی‌ها

### 👨‍💼 مدیریت ادمین
- مدیریت دانش‌آموزان و معلمان
- ایجاد و مدیریت کلاس‌ها
- برنامه‌ریزی هفتگی
- گزارشات مالی و حضور و غیاب
- مدیریت اردوها

### 👨‍🏫 پنل معلم
- مشاهده کلاس‌های تدریس
- ثبت حضور و غیاب
- ثبت نمرات
- ارسال پیام و اطلاعیه
- مشاهده برنامه هفتگی

### 👨‍🎓 پنل دانش‌آموز
- مشاهده برنامه هفتگی
- مشاهده نمرات
- ثبت‌نام در اردو
- مشاهده اطلاعیه‌ها
- ارتباط با معلمان

## 🛠️ تکنولوژی‌ها

### Frontend
- **React 19** - کتابخانه UI
- **React Router** - مسیریابی
- **Bootstrap 5** - فریم‌ورک CSS
- **FontAwesome** - آیکون‌ها
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container setup
- **Nginx** - Reverse proxy
- **Make** - Task automation

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js (v16 یا بالاتر)
- npm یا yarn
- Docker و Docker Compose
- Git

### 1. کلون کردن پروژه
```bash
git clone <repository-url>
cd school
```

### 2. نصب dependencies
```bash
make install
# یا
npm install
```

### 3. راه‌اندازی دیتابیس
```bash
# راه‌اندازی MySQL با Docker
make docker-up

# راه‌اندازی دیتابیس
make setup
```

### 4. اجرای پروژه
```bash
# اجرای همزمان فرانت و بک
make dev

# یا اجرای جداگانه
make server-dev  # در ترمینال اول
npm start        # در ترمینال دوم
```

## 📁 ساختار پروژه

```
school/
├── src/                    # فرانت‌اند React
│   ├── components/        # کامپوننت‌ها
│   ├── pages/            # صفحات
│   ├── Layout/           # لایوت‌ها
│   └── App.js            # کامپوننت اصلی
├── server/                # بک‌اند Express
│   ├── routes/           # مسیرهای API
│   ├── models/           # مدل‌های Sequelize
│   ├── middleware/       # میدل‌ورها
│   ├── config.js         # تنظیمات
│   ├── database.js       # اتصال دیتابیس
│   └── server.js         # سرور اصلی
├── docker-compose.yml     # راه‌اندازی MySQL
├── docker-compose.prod.yml # راه‌اندازی production
├── Makefile               # اتوماسیون وظایف
└── README.md              # مستندات
```

## 🔧 دستورات مفید

### توسعه
```bash
make help          # نمایش راهنما
make dev           # اجرای همزمان فرانت و بک
make server-dev    # اجرای بک‌اند با nodemon
make setup         # راه‌اندازی دیتابیس
```

### Docker
```bash
make docker-up     # راه‌اندازی MySQL
make docker-down   # توقف MySQL
make docker-build  # راه‌اندازی کامل
make docker-prod   # راه‌اندازی production
```

### نگهداری
```bash
make clean         # پاک کردن فایل‌های موقت
make db-reset      # بازسازی دیتابیس
make db-seed       # ایجاد داده‌های نمونه
make status        # نمایش وضعیت سرویس‌ها
```

## 🌐 دسترسی‌ها

پس از راه‌اندازی:

- **فرانت‌اند**: http://localhost:3000
- **بک‌اند API**: http://localhost:4000
- **MySQL**: localhost:3306
- **phpMyAdmin**: http://localhost:8080

## 🔐 حساب‌های پیش‌فرض

### ادمین
- **نام کاربری**: admin
- **رمز عبور**: admin123
- **ایمیل**: admin@school.com

### معلم نمونه
- **نام کاربری**: teacher1
- **رمز عبور**: teacher123
- **ایمیل**: teacher1@school.com

### دانش‌آموز نمونه
- **نام کاربری**: student1
- **رمز عبور**: student123
- **ایمیل**: student1@school.com

## 📊 API Endpoints

### احراز هویت
- `POST /api/auth/login` - ورود معلم
- `POST /api/auth/student-login` - ورود دانش‌آموز
- `POST /api/auth/register` - ثبت‌نام

### معلمان
- `GET /api/teachers/profile` - پروفایل معلم
- `GET /api/teachers/classes` - کلاس‌های معلم
- `POST /api/teachers/attendance` - ثبت حضور و غیاب

### دانش‌آموزان
- `GET /api/students/profile` - پروفایل دانش‌آموز
- `GET /api/students/schedule` - برنامه هفتگی
- `GET /api/students/trips` - اردوها

### ادمین
- `POST /api/admin/students` - افزودن دانش‌آموز
- `POST /api/admin/teachers` - افزودن معلم
- `POST /api/admin/classes` - ایجاد کلاس
- `GET /api/admin/reports` - گزارشات

## 🚀 راه‌اندازی Production

### 1. تنظیم متغیرهای محیطی
```bash
cp env.example .env
# مقادیر را در فایل .env تنظیم کنید
```

### 2. راه‌اندازی با Docker
```bash
make docker-prod
```

### 3. بررسی وضعیت
```bash
make status
```

## 🔒 امنیت

- **JWT Authentication** - احراز هویت با توکن
- **Password Hashing** - رمزگذاری رمز عبور
- **Rate Limiting** - محدودیت تعداد درخواست
- **Helmet** - هدرهای امنیتی
- **CORS** - کنترل دسترسی cross-origin
- **Input Validation** - اعتبارسنجی ورودی‌ها

## 🧪 تست

### Health Check
```bash
curl http://localhost:4000/api/health
```

### تست اتصال دیتابیس
```bash
make setup
```

## 🚨 عیب‌یابی

### مشکلات رایج

1. **خطای اتصال دیتابیس**
   ```bash
   make docker-up
   make setup
   ```

2. **خطای CORS**
   - بررسی تنظیمات CORS در `server/config.js`

3. **خطای JWT**
   - بررسی `JWT_SECRET` در فایل `.env`

4. **پورت در حال استفاده**
   ```bash
   # تغییر پورت در .env
   PORT=4001
   ```

## 📝 لاگ‌ها

### بک‌اند
```bash
make logs-backend
```

### MySQL
```bash
make logs-mysql
```

## 🤝 مشارکت

برای مشارکت در پروژه:

1. Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add amazing feature'`)
4. Branch را push کنید (`git push origin feature/amazing-feature`)
5. Pull Request ارسال کنید

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

## 📞 پشتیبانی

برای سوالات و مشکلات:

- **Issues**: GitHub Issues
- **Email**: support@school.com
- **Telegram**: @school_support

## 🙏 تشکر

از تمام کسانی که در توسعه این پروژه مشارکت داشته‌اند تشکر می‌کنیم.

---

**نکته**: این پروژه برای اهداف آموزشی و توسعه‌ای طراحی شده است. برای استفاده در محیط production، لطفاً تنظیمات امنیتی مناسب را اعمال کنید.
