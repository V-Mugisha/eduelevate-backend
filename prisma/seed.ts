import { PrismaClient } from "./generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env["DATABASE_URL"],
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const permissions = [
  { name: "user:create", description: "Create user accounts" },
  { name: "user:read", description: "View user profiles" },
  { name: "user:update", description: "Update user profiles" },
  { name: "user:delete", description: "Delete user accounts" },
  { name: "course:create", description: "Create courses" },
  { name: "course:read", description: "View courses" },
  { name: "course:update", description: "Update courses" },
  { name: "course:delete", description: "Delete courses" },
  { name: "exercise:create", description: "Create exercises" },
  { name: "exercise:read", description: "View exercises" },
  { name: "exercise:update", description: "Update exercises" },
  { name: "exercise:delete", description: "Delete exercises" },
  { name: "exercise:grade", description: "Grade student exercise submissions" },
  { name: "progress:read", description: "View student progress" },
  { name: "progress:report", description: "Generate progress reports" },
  { name: "system:manage", description: "Full system administration" },
  { name: "role:manage", description: "Assign and revoke roles" },
  { name: "permission:read", description: "View system permissions" },
];

const studentPermissions = ["user:read", "user:update", "course:read", "exercise:read"];

const educatorPermissions = [
  "user:read",
  "user:update",
  "course:create",
  "course:read",
  "course:update",
  "course:delete",
  "exercise:create",
  "exercise:read",
  "exercise:update",
  "exercise:delete",
  "exercise:grade",
  "progress:read",
  "progress:report",
];

const adminPermissions = permissions.map((p) => p.name);

async function main() {
  console.log("Seeding permissions...");
  const createdPermissions: Record<string, string> = {};
  for (const permission of permissions) {
    const created = await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });
    createdPermissions[created.name] = created.id;
  }

  console.log("Seeding roles...");
  const studentRole = await prisma.role.upsert({
    where: { name: "student" },
    update: { description: "Advanced level secondary school student" },
    create: { name: "student", description: "Advanced level secondary school student" },
  });

  const educatorRole = await prisma.role.upsert({
    where: { name: "educator" },
    update: { description: "Course creator, tutor, and mentor" },
    create: { name: "educator", description: "Course creator, tutor, and mentor" },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: { description: "Platform administrator with full system access" },
    create: { name: "admin", description: "Platform administrator with full system access" },
  });

  console.log("Assigning permissions to roles...");
  const rolePermissionMap: Record<string, { roleId: string; assignments: string[] }> = {
    student: { roleId: studentRole.id, assignments: studentPermissions },
    educator: { roleId: educatorRole.id, assignments: educatorPermissions },
    admin: { roleId: adminRole.id, assignments: adminPermissions },
  };

  for (const [, config] of Object.entries(rolePermissionMap)) {
    for (const permissionName of config.assignments) {
      const permissionId = createdPermissions[permissionName];
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: config.roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId: config.roleId,
          permissionId,
        },
      });
    }
  }

  console.log("Seeding super admin user...");
  const SALT_ROUNDS = 12;
  const passwordHash = await bcrypt.hash("Admin@123", SALT_ROUNDS);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@eduelevate.com" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "admin@eduelevate.com",
        passwordHash,
        firstName: "Platform",
        lastName: "Administrator",
        roleId: adminRole.id,
      },
    });
    console.log("Super admin user created.");
  } else {
    console.log("Super admin user already exists, skipping.");
  }

  const categories = [
    { name: "Web Development", description: "Build websites and web applications" },
    { name: "Mobile Development", description: "Create apps for Android and iOS" },
    { name: "Data Science", description: "Analyze data and build ML models" },
    { name: "Cybersecurity", description: "Protect systems and networks" },
    { name: "UI/UX Design", description: "Design beautiful user interfaces" },
  ];

  const sampleCourses = [
    {
      title: "Introduction to HTML & CSS",
      subtitle: "Learn the building blocks of the web",
      description:
        "This course teaches you how to create beautiful web pages using HTML for structure and CSS for styling. You will build your first personal website from scratch, learning about layouts, colors, typography, and responsive design principles.",
      category: "Web Development",
      level: "beginner",
      duration: "4 weeks",
    },
    {
      title: "JavaScript for Beginners",
      subtitle: "Start programming interactive websites",
      description:
        "JavaScript is the language of the web. In this course, you will learn variables, functions, loops, DOM manipulation, and event handling. By the end, you will be able to add interactivity to any website.",
      category: "Web Development",
      level: "beginner",
      duration: "6 weeks",
    },
    {
      title: "Building APIs with Node.js",
      subtitle: "Create powerful backend services",
      description:
        "Learn how to build RESTful APIs using Node.js and Express. You will understand routing, middleware, authentication with JWT, database integration with Prisma, and deploy your API to the cloud.",
      category: "Web Development",
      level: "intermediate",
      duration: "8 weeks",
    },
    {
      title: "Android App Development with Kotlin",
      subtitle: "Build your first mobile application",
      description:
        "Dive into Android development using Kotlin, the modern language for mobile apps. Create user interfaces with Jetpack Compose, handle user input, navigate between screens, and connect to APIs.",
      category: "Mobile Development",
      level: "intermediate",
      duration: "10 weeks",
    },
    {
      title: "Python for Data Analysis",
      subtitle: "Turn raw data into actionable insights",
      description:
        "Master Python's data science stack: NumPy for numerical computing, Pandas for data manipulation, and Matplotlib for visualization. Work with real-world datasets and present your findings effectively.",
      category: "Data Science",
      level: "beginner",
      duration: "6 weeks",
    },
    {
      title: "Machine Learning Fundamentals",
      subtitle: "Understand how machines learn from data",
      description:
        "Explore supervised and unsupervised learning algorithms. Build classification and regression models using scikit-learn. Learn about model evaluation, feature engineering, and deployment considerations.",
      category: "Data Science",
      level: "intermediate",
      duration: "10 weeks",
    },
    {
      title: "Introduction to Cybersecurity",
      subtitle: "Defend systems against digital threats",
      description:
        "Understand the fundamentals of cybersecurity: threat modeling, encryption, network security, and ethical hacking. Learn how to identify vulnerabilities and protect systems from common attacks.",
      category: "Cybersecurity",
      level: "beginner",
      duration: "8 weeks",
    },
    {
      title: "UI/UX Design Principles",
      subtitle: "Create interfaces users love",
      description:
        "Learn the principles of user-centered design. Understand color theory, typography, information architecture, wireframing, prototyping with Figma, and usability testing to create intuitive digital experiences.",
      category: "UI/UX Design",
      level: "beginner",
      duration: "5 weeks",
    },
  ];

  const existingAdminUser = await prisma.user.findUnique({ where: { email: "admin@eduelevate.com" } });
  const courseCreatorId = existingAdminUser?.id ?? adminRole.id;

  console.log("Seeding categories and sample courses...");
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: cat,
    });

    const categoryCourses = sampleCourses.filter((c) => c.category === cat.name);
    for (const course of categoryCourses) {
      const existing = await prisma.course.findFirst({ where: { title: course.title } });
      if (!existing) {
        await prisma.course.create({
          data: {
            title: course.title,
            subtitle: course.subtitle,
            description: course.description,
            categoryId: created.id,
            level: course.level,
            duration: course.duration,
            isPublished: true,
            createdBy: courseCreatorId,
          },
        });
      }
    }
  }

  console.log("Seeding modules and lessons...");
  const htmlCourse = await prisma.course.findFirst({ where: { title: "Introduction to HTML & CSS" } });
  if (htmlCourse) {
    const existingModules = await prisma.module.count({ where: { courseId: htmlCourse.id } });
    if (existingModules === 0) {
      const mod1 = await prisma.module.create({
        data: {
          courseId: htmlCourse.id,
          title: "Getting Started with HTML",
          subtitle: "Learn the foundation of every web page",
          description: "In this module, we will explore what HTML is, how it works, and write our first lines of code.",
          prerequisites: [],
        },
      });
      await prisma.lesson.createMany({
        data: [
          { moduleId: mod1.id, title: "What is HTML?", subtitle: "Understanding HyperText Markup Language", content: "<p>HTML stands for <b>HyperText Markup Language</b>. It is the standard language used to create web pages.</p><p>Every website you visit is built with HTML at its core. It provides the <b>structure</b> and <b>meaning</b> to web content.</p>" },
          { moduleId: mod1.id, title: "Setting Up Your First HTML File", subtitle: "Your development environment", content: "<h2>Creating Your First HTML File</h2><p>Open any text editor and create a new file called <b>index.html</b>. Add the following code:</p><p>This is the basic structure every HTML document needs. The <b>DOCTYPE</b> tells the browser what version of HTML to expect.</p>" },
          { moduleId: mod1.id, title: "HTML Elements and Tags", subtitle: "The building blocks of web pages", content: "<p>HTML uses <b>tags</b> to define elements. A tag is enclosed in angle brackets like <b>&lt;tagname&gt;</b>.</p><p>Most elements have an opening tag, content, and a closing tag. For example: <b>&lt;p&gt;Hello World&lt;/p&gt;</b></p>" },
        ],
      });

      const mod2 = await prisma.module.create({
        data: {
          courseId: htmlCourse.id,
          title: "Styling with CSS",
          subtitle: "Make your pages beautiful",
          description: "Now that you can structure content with HTML, it is time to learn how to style it with CSS.",
          prerequisites: ["Basic HTML knowledge"],
        },
      });
      await prisma.lesson.createMany({
        data: [
          { moduleId: mod2.id, title: "Introduction to CSS", subtitle: "Cascading Style Sheets explained", content: "<p>CSS stands for <b>Cascading Style Sheets</b>. It describes how HTML elements should be displayed.</p><p>With CSS, you can control the <i>color</i>, <i>font</i>, <i>spacing</i>, and <i>layout</i> of your web pages.</p>" },
          { moduleId: mod2.id, title: "CSS Selectors and Properties", subtitle: "Targeting HTML elements", content: "<h2>CSS Selectors</h2><p>Selectors are patterns used to select the elements you want to style. The most common selectors are <b>element</b>, <b>class</b>, and <b>ID</b> selectors.</p><p>For example, <b>p { color: blue; }</b> makes all paragraphs blue.</p>" },
          { moduleId: mod2.id, title: "Colors and Typography", subtitle: "Working with text and colors", content: "<p>CSS gives you control over colors using names, hex codes, RGB, or HSL values.</p><p>Typography includes properties like <b>font-family</b>, <b>font-size</b>, <b>font-weight</b>, and <b>line-height</b>. Good typography makes your content readable and professional.</p>" },
        ],
      });
    }
  }

  console.log("Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
