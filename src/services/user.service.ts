import { prisma } from "config/client";
import getConnection from "config/database";

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const handleCreateUser = async (
  fullName: string,
  email: string,
  address: string
) => {
  // inser into database
  const newUser = await prisma.user.create({
    data: {
      name: fullName,
      email: email,
      address: address,
    },
  });
  //return result
  return newUser;
};

const handleDeleteUser = async (id: string) => {
  const deleteUser = await prisma.user.delete({ where: { id: +id } });
  return deleteUser;
};

const handleViewUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id: +id } });
  return user;
};

const handleUpdateUser = async (
  id: string,
  fullName: string,
  email: string,
  address: string
) => {
  const updated = await prisma.user.update({
    where: { id: +id },
    data: {
      name: fullName,
      email: email,
      address: address,
    },
  });
  return updated;
};

export {
  handleCreateUser,
  getAllUsers,
  handleDeleteUser,
  handleViewUser,
  handleUpdateUser,
};
