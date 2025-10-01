import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import bcrypt from "bcrypt";
const saltRounds = 10;

const hashPassword = async (plainText: string) => {
  return await bcrypt.hash(plainText, saltRounds);
};

const comparePassword = async (plainText: string, hashPassword: string) => {
  return await bcrypt.compare(plainText, hashPassword);
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const getAllRoles = async () => {
  const roles = await prisma.role.findMany();
  return roles;
};

const handleCreateUser = async (
  fullName: string,
  email: string,
  address: string,
  phone: string,
  avatar: string,
  role: string
) => {
  // inser into database
  const defaultPassword = await hashPassword("123456");
  const newUser = await prisma.user.create({
    data: {
      fullName: fullName,
      username: email,
      address: address,
      password: defaultPassword,
      accountType: ACCOUNT_TYPE.SYSTEM,
      avatar: avatar,
      phone: phone,
      roleId: +role,
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
  phone: string,
  role: string,
  address: string,
  avatar: string
) => {
  const updated = await prisma.user.update({
    where: { id: +id },
    data: {
      fullName: fullName,
      address: address,
      phone: phone,
      roleId: +role,
      ...(avatar !== undefined && { avatar: avatar }),
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
  getAllRoles,
  hashPassword,
  comparePassword,
};
