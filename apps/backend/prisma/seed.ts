import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DIRECT_URL or DATABASE_URL is not configured');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing assessment data.
  await prisma.notification.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password@123', 12);

  // -------------------------
  // USERS
  // -------------------------

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const pm1 = await prisma.user.create({
    data: {
      name: 'Project Manager One',
      email: 'pm1@example.com',
      passwordHash,
      role: 'PROJECT_MANAGER',
    },
  });

  const pm2 = await prisma.user.create({
    data: {
      name: 'Project Manager Two',
      email: 'pm2@example.com',
      passwordHash,
      role: 'PROJECT_MANAGER',
    },
  });

  const developers = await Promise.all(
    [
      ['Developer One', 'dev1@example.com'],
      ['Developer Two', 'dev2@example.com'],
      ['Developer Three', 'dev3@example.com'],
      ['Developer Four', 'dev4@example.com'],
    ].map(([name, email]) =>
      prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'DEVELOPER',
        },
      }),
    ),
  );

  console.log('✅ Users created');

  // -------------------------
  // CLIENTS
  // -------------------------

  const client1 = await prisma.client.create({
    data: {
      name: 'Acme Corporation',
      email: 'contact@acme.example.com',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Globex Corporation',
      email: 'contact@globex.example.com',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'Initech',
      email: 'contact@initech.example.com',
    },
  });

  console.log('✅ Clients created');

  // -------------------------
  // PROJECTS
  // -------------------------

  const project1 = await prisma.project.create({
    data: {
      name: 'Acme Website Revamp',
      description: 'Website redesign and modernization project.',
      clientId: client1.id,
      createdById: pm1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Globex Mobile Application',
      description: 'Mobile application development project.',
      clientId: client2.id,
      createdById: pm1.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Initech Analytics Platform',
      description: 'Analytics and reporting platform.',
      clientId: client3.id,
      createdById: pm2.id,
    },
  });

  console.log('✅ Projects created');

  // -------------------------
  // TASKS
  // -------------------------

  const projects = [
    project1,
    project2,
    project3,
  ];

  const statuses = [
    'TODO',
    'IN_PROGRESS',
    'IN_REVIEW',
    'DONE',
    'TODO',
  ] as const;

  const priorities = [
    'CRITICAL',
    'HIGH',
    'MEDIUM',
    'LOW',
    'HIGH',
  ] as const;

  const developerAssignments = [
    developers[0],
    developers[1],
    developers[2],
    developers[3],
    developers[0],
  ];

  for (let projectIndex = 0; projectIndex < projects.length; projectIndex++) {
    const project = projects[projectIndex];

    for (let taskIndex = 0; taskIndex < 5; taskIndex++) {
      const isOverdue =
        (projectIndex === 0 && taskIndex === 0) ||
        (projectIndex === 1 && taskIndex === 1);

      const dueDate = isOverdue
        ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + (taskIndex + 1) * 3 * 24 * 60 * 60 * 1000);

      const task = await prisma.task.create({
        data: {
          projectId: project.id,
          title: `Task ${taskIndex + 1} - ${project.name}`,
          description: `Implementation task ${taskIndex + 1} for ${project.name}.`,
          assignedDeveloperId: developerAssignments[taskIndex].id,
          status: statuses[taskIndex],
          priority: priorities[taskIndex],
          dueDate,
          isOverdue,
        },
      });

      // Initial activity
      await prisma.activity.create({
        data: {
          projectId: project.id,
          taskId: task.id,
          userId: developerAssignments[taskIndex].id,
          action: 'Task created',
          toStatus: 'TODO',
        },
      });

      // Activity for status changes
      if (statuses[taskIndex] !== 'TODO') {
        await prisma.activity.create({
          data: {
            projectId: project.id,
            taskId: task.id,
            userId: developerAssignments[taskIndex].id,
            action: `Task moved to ${statuses[taskIndex]}`,
            fromStatus: 'TODO',
            toStatus: statuses[taskIndex],
          },
        });
      }

      // Assignment notification
      await prisma.notification.create({
        data: {
          userId: developerAssignments[taskIndex].id,
          taskId: task.id,
          projectId: project.id,
          type: 'TASK_ASSIGNED',
          message: `You have been assigned: ${task.title}`,
        },
      });

      // Notify PM when task is in review
      if (statuses[taskIndex] === 'IN_REVIEW') {
        const projectManager =
          project.createdById === pm1.id ? pm1 : pm2;

        await prisma.notification.create({
          data: {
            userId: projectManager.id,
            taskId: task.id,
            projectId: project.id,
            type: 'TASK_IN_REVIEW',
            message: `${task.title} has been moved to In Review.`,
          },
        });
      }
    }
  }

  console.log('✅ Tasks created');
  console.log('✅ Activities created');
  console.log('✅ Notifications created');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\nTest accounts:');
  console.log('Admin: admin@example.com');
  console.log('PM 1: pm1@example.com');
  console.log('PM 2: pm2@example.com');
  console.log('Developer 1: dev1@example.com');
  console.log('Developer 2: dev2@example.com');
  console.log('Developer 3: dev3@example.com');
  console.log('Developer 4: dev4@example.com');
  console.log('\nPassword: Password@123');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });