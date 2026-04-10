"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StudentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUserSub() {
  const session = await auth();
  const sub = session?.user?.id;
  if (!sub) redirect("/api/auth/signin/mercantec");
  return sub;
}

export async function createCompany(formData: FormData) {
  await requireUserSub();
  const name = String(formData.get("name") ?? "").trim();
  const websiteRaw = String(formData.get("website") ?? "").trim();
  if (!name) return;
  const website =
    websiteRaw === ""
      ? null
      : websiteRaw.startsWith("http")
        ? websiteRaw
        : `https://${websiteRaw}`;
  await prisma.company.create({ data: { name, website } });
  revalidatePath("/");
  revalidatePath("/partnere");
}

export async function deleteCompany(formData: FormData) {
  await requireUserSub();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.company.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/partnere");
  revalidatePath("/elever");
}

export async function createStudent(formData: FormData) {
  const sub = await requireUserSub();
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!displayName) return;
  const status = (String(formData.get("status") ?? "SEEKING") as StudentStatus) || "SEEKING";
  const companyIdRaw = String(formData.get("companyId") ?? "").trim();
  const companyId = companyIdRaw === "" ? null : companyIdRaw;
  const note = String(formData.get("note") ?? "").trim() || null;

  if (status === "PLACED" && !companyId) return;

  await prisma.student.create({
    data: {
      displayName,
      status: status === "PLACED" ? "PLACED" : "SEEKING",
      companyId: status === "PLACED" ? companyId : null,
      note,
      createdBySub: sub,
    },
  });
  revalidatePath("/elever");
}

export async function updateStudent(formData: FormData) {
  await requireUserSub();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!displayName) return;
  const status = String(formData.get("status") ?? "SEEKING") as StudentStatus;
  const companyIdRaw = String(formData.get("companyId") ?? "").trim();
  const companyId = companyIdRaw === "" ? null : companyIdRaw;
  const note = String(formData.get("note") ?? "").trim() || null;

  if (status === "PLACED" && !companyId) return;

  await prisma.student.update({
    where: { id },
    data: {
      displayName,
      status: status === "PLACED" ? "PLACED" : "SEEKING",
      companyId: status === "PLACED" ? companyId : null,
      note,
    },
  });
  revalidatePath("/elever");
}

export async function deleteStudent(formData: FormData) {
  await requireUserSub();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.student.delete({ where: { id } });
  revalidatePath("/elever");
}
