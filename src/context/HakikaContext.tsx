"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "diaspora" | "agent" | "admin" | "investor";

export type MilestoneStatus =
  | "Pending"
  | "Held"
  | "Submitted"
  | "Released"
  | "Disputed";

export type AdminReviewState = "Queued" | "Approved" | "Rejected";

export type Evidence = {
  photoUrl: string;
  receiptText: string;
  receiptAmount: number;
  geoTag: string;
  timestamp: string;
  notes: string;
  agentName: string;
};

export type Milestone = {
  id: string;
  title: string;
  budget: number;
  status: MilestoneStatus;
  targetOutcome: string;
  agentTask: string;
  dueDate: string;
  adminReview: AdminReviewState;
  evidence?: Evidence;
};

export type Project = {
  id: string;
  name: string;
  category: "Construction" | "Land Check" | "School Fees" | "Medical Support";
  location: string;
  county: string;
  totalBudget: number;
  currentStage: string;
  createdAt: string;
  sponsor: string;
  milestones: Milestone[];
};

export type SimulatedLedger = {
  deposited: number;
  held: number;
  released: number;
  disputed: number;
  platformFees: number;
};

export type HakikaNotification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  role: UserRole | "system";
  tone: "success" | "info" | "warning" | "destructive";
};

export type NewMilestoneInput = {
  title: string;
  budget: number;
  targetOutcome: string;
};

export type NewProjectInput = {
  name: string;
  category: Project["category"];
  location: string;
  county: string;
  sponsor: string;
  milestones: NewMilestoneInput[];
};

export type AgentEvidenceInput = {
  receiptAmount: number;
  receiptText: string;
  notes: string;
};

type HakikaContextValue = {
  projects: Project[];
  simulatedLedger: SimulatedLedger;
  notifications: HakikaNotification[];
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  createProject: (input: NewProjectInput) => Project;
  submitAgentEvidence: (
    projectId: string,
    milestoneId: string,
    input: AgentEvidenceInput
  ) => void;
  approveAgentProof: (projectId: string, milestoneId: string) => void;
  rejectAgentProof: (projectId: string, milestoneId: string) => void;
  approveMilestoneRelease: (projectId: string, milestoneId: string) => void;
  raiseDisputeFlag: (projectId: string, milestoneId: string) => void;
  getProjectById: (projectId: string) => Project | undefined;
};

const evidencePhotos = [
  "/assets/hakika-hero.png",
  "/assets/hakika-hero.png",
  "/assets/hakika-hero.png",
];

const nowIso = "2026-05-29T16:40:00+03:00";

const initialProjects: Project[] = [
  {
    id: "kisumu-roofing",
    name: "Mum's House Roofing - Kisumu",
    category: "Construction",
    location: "Milimani Estate, Kisumu",
    county: "Kisumu",
    totalBudget: 850000,
    currentStage: "Roof truss evidence awaiting client release",
    createdAt: "2026-05-12",
    sponsor: "Achieng O. - Minneapolis",
    milestones: [
      {
        id: "kisumu-materials",
        title: "Roofing materials purchase",
        budget: 320000,
        status: "Released",
        targetOutcome:
          "Procure mabati sheets, timber battens, fasteners, and guttering.",
        agentTask: "Verify roofing materials delivery at Kisumu site",
        dueDate: "2026-05-17",
        adminReview: "Approved",
        evidence: {
          photoUrl: evidencePhotos[0],
          receiptText: "Receipt KSM-4482: Royal Mabati + timber supplier",
          receiptAmount: 317600,
          geoTag: "-0.0917, 34.7680 - Kisumu, Kenya",
          timestamp: "2026-05-17T10:24:00+03:00",
          notes:
            "Supplier delivery note matches material list. Minor KSh 2,400 underrun retained in escrow.",
          agentName: "Brian Otieno",
        },
      },
      {
        id: "kisumu-truss",
        title: "Truss installation and site progress",
        budget: 250000,
        status: "Submitted",
        targetOutcome:
          "Install timber trusses and confirm structural progress before release.",
        agentTask: "Capture roof truss progress and carpenter receipt",
        dueDate: "2026-05-27",
        adminReview: "Approved",
        evidence: {
          photoUrl: evidencePhotos[1],
          receiptText: "Receipt KSM-4509: Fundi labor + truss reinforcement",
          receiptAmount: 248500,
          geoTag: "-0.0921, 34.7673 - Kisumu, Kenya",
          timestamp: "2026-05-28T14:42:00+03:00",
          notes:
            "Trusses installed across main span. Admin verified photo metadata and material continuity.",
          agentName: "Brian Otieno",
        },
      },
      {
        id: "kisumu-waterproofing",
        title: "Final waterproofing and gutters",
        budget: 280000,
        status: "Held",
        targetOutcome:
          "Complete waterproofing, gutter alignment, and rainy-season readiness check.",
        agentTask: "Return after release for final weatherproofing proof",
        dueDate: "2026-06-04",
        adminReview: "Queued",
      },
    ],
  },
  {
    id: "kajiado-boundary",
    name: "Kajiado Plot 4 Boundary Wall",
    category: "Land Check",
    location: "Kitengela outskirts, Kajiado",
    county: "Kajiado",
    totalBudget: 620000,
    currentStage: "Foundation milestone held in escrow",
    createdAt: "2026-05-08",
    sponsor: "Njeri K. - London",
    milestones: [
      {
        id: "kajiado-survey",
        title: "Survey and beacon confirmation",
        budget: 140000,
        status: "Released",
        targetOutcome:
          "Confirm beacon coordinates and title reference before construction.",
        agentTask: "Validate surveyor beacon points and title copy",
        dueDate: "2026-05-14",
        adminReview: "Approved",
        evidence: {
          photoUrl: evidencePhotos[2],
          receiptText: "Surveyor invoice KJD-7721 and beacon report",
          receiptAmount: 138000,
          geoTag: "-1.5241, 36.8539 - Kajiado, Kenya",
          timestamp: "2026-05-14T09:10:00+03:00",
          notes:
            "Beacon points matched the registry sketch. Two neighbors acknowledged boundary line.",
          agentName: "Faith Wanjiku",
        },
      },
      {
        id: "kajiado-foundation",
        title: "Stone delivery and wall foundation",
        budget: 260000,
        status: "Held",
        targetOutcome:
          "Deliver foundation stone, sand, and cement; confirm trench line completion.",
        agentTask: "Inspect delivery and trench measurements",
        dueDate: "2026-05-31",
        adminReview: "Queued",
      },
      {
        id: "kajiado-wall",
        title: "Wall completion and gate pillars",
        budget: 220000,
        status: "Pending",
        targetOutcome:
          "Complete perimeter wall, gate pillar plumb checks, and final photos.",
        agentTask: "Final build verification after foundation release",
        dueDate: "2026-06-12",
        adminReview: "Queued",
      },
    ],
  },
  {
    id: "eldoret-school-fees",
    name: "Eldoret Academy Term Support",
    category: "School Fees",
    location: "Langas, Eldoret",
    county: "Uasin Gishu",
    totalBudget: 260000,
    currentStage: "Invoice evidence submitted for sponsor approval",
    createdAt: "2026-05-18",
    sponsor: "Kiptoo M. - Seattle",
    milestones: [
      {
        id: "eldoret-invoice",
        title: "Term invoice verification",
        budget: 160000,
        status: "Submitted",
        targetOutcome:
          "Validate school invoice, student admission number, and payment channel.",
        agentTask: "Verify term invoice at school bursar office",
        dueDate: "2026-05-25",
        adminReview: "Approved",
        evidence: {
          photoUrl: evidencePhotos[0],
          receiptText: "Invoice ELD-AC-1038: Term 2 tuition and boarding",
          receiptAmount: 160000,
          geoTag: "0.5143, 35.2698 - Eldoret, Kenya",
          timestamp: "2026-05-25T11:36:00+03:00",
          notes:
            "Bursar confirmed invoice number and student registration. M-Pesa paybill ready for release.",
          agentName: "Mercy Chebet",
        },
      },
      {
        id: "eldoret-supplies",
        title: "Boarding supplies and uniform check",
        budget: 100000,
        status: "Held",
        targetOutcome:
          "Purchase term supplies and confirm uniform measurements with guardian.",
        agentTask: "Collect receipts and guardian sign-off for supplies",
        dueDate: "2026-06-02",
        adminReview: "Queued",
      },
    ],
  },
];

const initialLedger: SimulatedLedger = {
  deposited: 1730000,
  held: 1110000,
  released: 460000,
  disputed: 0,
  platformFees: 18400,
};

const initialNotifications: HakikaNotification[] = [
  {
    id: "note-initial-1",
    title: "Kisumu proof approved by admin",
    message:
      "Roof truss evidence is ready for diaspora client review and release.",
    timestamp: "2026-05-28T15:05:00+03:00",
    role: "diaspora",
    tone: "info",
  },
  {
    id: "note-initial-2",
    title: "Escrow ledger reconciled",
    message:
      "KSh 1.73M simulated deposits balanced across held, released, and disputed buckets.",
    timestamp: nowIso,
    role: "system",
    tone: "success",
  },
];

const HakikaContext = createContext<HakikaContextValue | undefined>(undefined);

function formatTimestamp(): string {
  return new Date().toISOString();
}

function makeNotification(
  title: string,
  message: string,
  role: HakikaNotification["role"],
  tone: HakikaNotification["tone"] = "info"
): HakikaNotification {
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    message,
    role,
    tone,
    timestamp: formatTimestamp(),
  };
}

function nextProjectStage(milestones: Milestone[]): string {
  if (milestones.some((milestone) => milestone.status === "Disputed")) {
    return "Dispute review active";
  }

  if (milestones.every((milestone) => milestone.status === "Released")) {
    return "Project fully verified and released";
  }

  const submitted = milestones.find(
    (milestone) => milestone.status === "Submitted"
  );

  if (submitted) {
    return `${submitted.title} awaiting client release`;
  }

  const held = milestones.find((milestone) => milestone.status === "Held");

  if (held) {
    return `${held.title} held in escrow`;
  }

  return "Pending kickoff";
}

function updateProjectMilestone(
  projects: Project[],
  projectId: string,
  milestoneId: string,
  updater: (milestone: Milestone) => Milestone
): Project[] {
  return projects.map((project) => {
    if (project.id !== projectId) {
      return project;
    }

    const milestones = project.milestones.map((milestone) =>
      milestone.id === milestoneId ? updater(milestone) : milestone
    );

    return {
      ...project,
      currentStage: nextProjectStage(milestones),
      milestones,
    };
  });
}

function findMilestone(
  projects: Project[],
  projectId: string,
  milestoneId: string
): Milestone | undefined {
  return projects
    .find((project) => project.id === projectId)
    ?.milestones.find((milestone) => milestone.id === milestoneId);
}

function createMilestones(inputs: NewMilestoneInput[]): Milestone[] {
  return inputs.map((milestone, index) => ({
    id: `m-${Date.now()}-${index}`,
    title: milestone.title,
    budget: milestone.budget,
    status: index === 0 ? "Held" : "Pending",
    targetOutcome: milestone.targetOutcome,
    agentTask: `Verify ${milestone.title.toLowerCase()}`,
    dueDate: "2026-06-15",
    adminReview: "Queued",
  }));
}

export function HakikaProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [simulatedLedger, setSimulatedLedger] =
    useState<SimulatedLedger>(initialLedger);
  const [notifications, setNotifications] =
    useState<HakikaNotification[]>(initialNotifications);
  const [currentUserRole, setRole] = useState<UserRole>("diaspora");

  const pushNotification = useCallback((notification: HakikaNotification) => {
    setNotifications((current) => [notification, ...current].slice(0, 20));
  }, []);

  const setCurrentUserRole = useCallback(
    (role: UserRole) => {
      setRole(role);
      pushNotification(
        makeNotification(
          "Demo role switched",
          `Active portal changed to ${role}.`,
          role,
          "info"
        )
      );
    },
    [pushNotification]
  );

  const createProject = useCallback(
    (input: NewProjectInput): Project => {
      const milestones = createMilestones(input.milestones);
      const totalBudget = milestones.reduce(
        (sum, milestone) => sum + milestone.budget,
        0
      );
      const project: Project = {
        id: `project-${Date.now()}`,
        name: input.name,
        category: input.category,
        location: input.location,
        county: input.county,
        totalBudget,
        currentStage: nextProjectStage(milestones),
        createdAt: "2026-05-29",
        sponsor: input.sponsor,
        milestones,
      };

      setProjects((current) => [project, ...current]);
      setSimulatedLedger((ledger) => ({
        ...ledger,
        deposited: ledger.deposited + totalBudget,
        held: ledger.held + totalBudget,
      }));
      pushNotification(
        makeNotification(
          "New project request funded",
          `${project.name} added with KSh ${totalBudget.toLocaleString()} in simulated escrow.`,
          "admin",
          "success"
        )
      );

      return project;
    },
    [pushNotification]
  );

  const submitAgentEvidence = useCallback(
    (projectId: string, milestoneId: string, input: AgentEvidenceInput) => {
      const target = findMilestone(projects, projectId, milestoneId);
      if (!target || target.status === "Released") {
        return;
      }

      setProjects((current) =>
        updateProjectMilestone(current, projectId, milestoneId, (milestone) => ({
          ...milestone,
          status: "Submitted",
          adminReview: "Queued",
          evidence: {
            photoUrl:
              evidencePhotos[Math.floor(Math.random() * evidencePhotos.length)],
            receiptText: input.receiptText,
            receiptAmount: input.receiptAmount,
            geoTag: "-0.0919, 34.7684 - Auto-captured GPS",
            timestamp: formatTimestamp(),
            notes: input.notes,
            agentName: "Brian Otieno",
          },
        }))
      );
      pushNotification(
        makeNotification(
          "New agent evidence uploaded",
          `${target.title} proof submitted for admin review.`,
          "admin",
          "success"
        )
      );
    },
    [projects, pushNotification]
  );

  const approveAgentProof = useCallback(
    (projectId: string, milestoneId: string) => {
      const target = findMilestone(projects, projectId, milestoneId);
      if (!target || target.status !== "Submitted") {
        return;
      }

      setProjects((current) =>
        updateProjectMilestone(current, projectId, milestoneId, (milestone) => ({
          ...milestone,
          adminReview: "Approved",
        }))
      );
      pushNotification(
        makeNotification(
          "Admin verification approved",
          `${target.title} is now visible for client release approval.`,
          "diaspora",
          "success"
        )
      );
    },
    [projects, pushNotification]
  );

  const rejectAgentProof = useCallback(
    (projectId: string, milestoneId: string) => {
      const target = findMilestone(projects, projectId, milestoneId);
      if (!target || target.status !== "Submitted") {
        return;
      }

      setProjects((current) =>
        updateProjectMilestone(current, projectId, milestoneId, (milestone) => ({
          ...milestone,
          status: "Held",
          adminReview: "Rejected",
        }))
      );
      pushNotification(
        makeNotification(
          "Agent proof rejected",
          `${target.title} returned for additional evidence.`,
          "agent",
          "warning"
        )
      );
    },
    [projects, pushNotification]
  );

  const approveMilestoneRelease = useCallback(
    (projectId: string, milestoneId: string) => {
      const target = findMilestone(projects, projectId, milestoneId);
      if (!target || target.status !== "Submitted") {
        return;
      }

      const platformFee = Math.round(target.budget * 0.04);

      setProjects((current) =>
        updateProjectMilestone(current, projectId, milestoneId, (milestone) => ({
          ...milestone,
          status: "Released",
          adminReview: "Approved",
        }))
      );
      setSimulatedLedger((ledger) => ({
        ...ledger,
        held: Math.max(0, ledger.held - target.budget),
        released: ledger.released + target.budget,
        platformFees: ledger.platformFees + platformFee,
      }));
      pushNotification(
        makeNotification(
          "Milestone funds released",
          `${target.title} released with KSh ${platformFee.toLocaleString()} platform revenue recorded.`,
          "system",
          "success"
        )
      );
    },
    [projects, pushNotification]
  );

  const raiseDisputeFlag = useCallback(
    (projectId: string, milestoneId: string) => {
      const target = findMilestone(projects, projectId, milestoneId);
      if (!target || target.status === "Released") {
        return;
      }

      setProjects((current) =>
        updateProjectMilestone(current, projectId, milestoneId, (milestone) => ({
          ...milestone,
          status: "Disputed",
        }))
      );
      setSimulatedLedger((ledger) => ({
        ...ledger,
        held: Math.max(0, ledger.held - target.budget),
        disputed: ledger.disputed + target.budget,
      }));
      pushNotification(
        makeNotification(
          "Dispute flag raised",
          `${target.title} moved to dispute operations review.`,
          "admin",
          "destructive"
        )
      );
    },
    [projects, pushNotification]
  );

  const getProjectById = useCallback(
    (projectId: string) => projects.find((project) => project.id === projectId),
    [projects]
  );

  const value = useMemo<HakikaContextValue>(
    () => ({
      projects,
      simulatedLedger,
      notifications,
      currentUserRole,
      setCurrentUserRole,
      createProject,
      submitAgentEvidence,
      approveAgentProof,
      rejectAgentProof,
      approveMilestoneRelease,
      raiseDisputeFlag,
      getProjectById,
    }),
    [
      projects,
      simulatedLedger,
      notifications,
      currentUserRole,
      setCurrentUserRole,
      createProject,
      submitAgentEvidence,
      approveAgentProof,
      rejectAgentProof,
      approveMilestoneRelease,
      raiseDisputeFlag,
      getProjectById,
    ]
  );

  return (
    <HakikaContext.Provider value={value}>{children}</HakikaContext.Provider>
  );
}

export function useHakika() {
  const context = useContext(HakikaContext);

  if (!context) {
    throw new Error("useHakika must be used within a HakikaProvider");
  }

  return context;
}
