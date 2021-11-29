import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@lib/auth";

import { ErrorCode, hashPassword, verifyPassword } from "@lib/auth";
import prisma from "@lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user?.email!,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const currentPassword = user.password;
  if (!currentPassword) {
    return res.status(400).json({ error: ErrorCode.UserMissingPassword });
  }

  const passwordsMatch = await verifyPassword(oldPassword, currentPassword);
  if (!passwordsMatch) {
    return res.status(403).json({ error: ErrorCode.IncorrectPassword });
  }

  if (oldPassword === newPassword) {
    return res.status(400).json({ error: ErrorCode.NewPasswordMatchesOld });
  }

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  res.status(200).json({ message: "Password updated successfully" });
}
