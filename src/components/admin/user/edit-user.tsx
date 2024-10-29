import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { InputText } from "../../input-text.tsx";
import { InputRadio } from "../../input-radio.tsx";

import {
  EditRounded,
  PersonRounded,
  Grid3x3Rounded,
  EmailRounded,
  PasswordRounded,
  SchoolRounded,
  ClassRounded,
  WorkRounded,
  VerifiedRounded,
  NewReleasesRounded,
  PersonOffRounded,
  HowToRegRounded,
} from "@mui/icons-material";
import {
  updateUser,
  UpdateUserParams,
  User,
} from "../../../services/users.service.ts";
import { toast } from "sonner";

interface EditUserDialogParamns {
  admin: User;
  user: User;
  onSucess: () => {};
}

export function EditUserDialog({
  admin,
  user,
  onSucess,
}: EditUserDialogParamns) {
  const [is_fixed_admin, setIsFixedAdmin] = useState(false);

  useEffect(() => {
    if (user.is_admin) {
      if (
        user.start_admin !== null &&
        user.end_admin !== null &&
        user.start_admin.length > 0 &&
        user.end_admin.length > 0
      ) {
        setIsFixedAdmin(false);
      } else {
        setIsFixedAdmin(false);
      }
    } else {
      setIsFixedAdmin(false);
    }
  }, []);

  const [admin_password, setAdminPassword] = useState("");

  const [currentUser, setCurrentUser] = useState<User>({
    id: user.id,
    name: user.name,
    institucional_id: user.institucional_id,
    email: user.email,
    role: user.role,
    authenticated: user.authenticated,
    is_admin: user.is_admin,
    start_admin: user.start_admin,
    end_admin: user.end_admin,
  });

  function handleChangeName(newName: string) {
    setCurrentUser((prevUser) => ({ ...prevUser, name: newName }));
  }

  function handleChangeInstitucionalId(newInstitucionalId: string) {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      institucional_id: newInstitucionalId,
    }));
  }

  function handleChangeEmail(newEmail: string) {
    setCurrentUser((prevUser) => ({ ...prevUser, email: newEmail }));
  }

  function handleChangeRole(newRole: string) {
    setCurrentUser((prevUser) => ({ ...prevUser, role: newRole }));
  }

  function handleChangeIsAdmin(newIsAdmin: boolean) {
    setCurrentUser((prevUser) => ({ ...prevUser, is_admin: newIsAdmin }));
  }

  function handleChangeStartAdmin(newStartAdmin: string) {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      start_admin: newStartAdmin,
    }));
  }

  function handleChangeEndAdmin(newEndAdmin: string) {
    setCurrentUser((prevUser) => ({ ...prevUser, end_admin: newEndAdmin }));
  }

  const handleInvalidDatesAdmin = () => {
    if (currentUser.start_admin != null && currentUser.end_admin != null) {
      const start = new Date(currentUser.start_admin);
      const end = new Date(currentUser.end_admin);
      return end <= start;
    }
    return false;
  };

  function handleIsAdmin(isAdmin: boolean) {
    if (isAdmin) {
      handleChangeIsAdmin(true);
    } else {
      handleChangeIsAdmin(false);
      setIsFixedAdmin(false);
      handleChangeEndAdmin("");
      handleChangeStartAdmin("");
    }
  }

  function handleFixedAdmin(isFixed: boolean) {
    if (isFixed) {
      setIsFixedAdmin(true);
      handleChangeEndAdmin("");
      handleChangeStartAdmin("");
    } else {
      setIsFixedAdmin(false);
    }
  }

  const handleSave = async () => {
    try {
      const updateParams: UpdateUserParams = {
        adminId: admin.id || "",
        user: currentUser,
        adminPassword: admin_password,
      };

      console.log(updateParams);

      await updateUser(updateParams);

      setAdminPassword("");

      onSucess();

      toast.success("Usuário atualizado com sucesso");
    } catch (error) {
      toast.error("Erro na atualização do usuário");
    }
  };

  function handleOpenChange() {
    setCurrentUser(user);
    if (user.is_admin) {
      if (
        user.start_admin !== null &&
        user.end_admin !== null &&
        user.start_admin.length > 0 &&
        user.end_admin.length > 0
      ) {
        setIsFixedAdmin(false);
      } else {
        setIsFixedAdmin(true);
      }
    } else {
      setIsFixedAdmin(false);
    }
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <span className="text-slate-500 bg-transparent p-2 flex items-center justify-center rounded-full hover:bg-slate-100">
          <EditRounded />
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden overflow-y-auto inset-0 md:inset-auto md:right-0 md:top-0 md:max-w-[640px] py-10 px-10 w-full md:h-full bg-white flex flex-col outline-none">
          <Dialog.Close className="absolute top-9 right-9 p-1.5 text-slate-500 hover:text-slate-400">
            <X className="size-5 " />
          </Dialog.Close>

          <h3 className="text-2xl font-semibold text-slate-500 mb-10">
            Atualização de usuário
          </h3>

          <form className="flex-1 flex flex-col">
            <div className="grid md:grid-cols-3 gap-4 w-full mb-2">
              <InputRadio
                text="Discente"
                icon={<SchoolRounded />}
                name="role"
                value="undergraduated"
                checked={currentUser.role === "undergraduated"}
                onChange={() => handleChangeRole("undergraduated")}
              />
              <InputRadio
                text="Docente"
                icon={<ClassRounded />}
                name="role"
                value="teacher"
                checked={currentUser.role === "teacher"}
                onChange={() => handleChangeRole("teacher")}
              />
              <InputRadio
                text="Técnico"
                icon={<WorkRounded />}
                name="role"
                value="technic"
                checked={currentUser.role === "technic"}
                onChange={() => handleChangeRole("technic")}
              />
            </div>
            <InputText
              text="Nome"
              icon={<PersonRounded />}
              placeholder="Nome"
              type="text"
              onChange={(e) => handleChangeName(e.target.value)}
              value={currentUser.name}
            />
            <InputText
              text={
                currentUser.role == "undergraduated" ? "Matrícula" : "SIAPE"
              }
              icon={<Grid3x3Rounded />}
              placeholder={
                currentUser.role == "undergraduated" ? "Matrícula" : "SIAPE"
              }
              type="string"
              onChange={(e) => handleChangeInstitucionalId(e.target.value)}
              value={currentUser.institucional_id}
            />
            <div>
              <InputText
                text="Email"
                icon={<EmailRounded />}
                placeholder="Email"
                type="email"
                onChange={(e) => handleChangeEmail(e.target.value)}
                value={currentUser.email}
              />
              <span
                className={`mt-5 text-sm font-medium ${
                  currentUser.authenticated
                    ? "text-green-700/80"
                    : "text-red-700/80"
                } flex md:flex-row flex-col gap-1 items-center `}
              >
                {currentUser.authenticated ? (
                  <>
                    <VerifiedRounded /> Email verificado
                  </>
                ) : (
                  <>
                    <NewReleasesRounded /> Email não verificado!{" "}
                    <button className="text-red-700 font-semibold underline">
                      Reenviar email de verificação.
                    </button>
                  </>
                )}
              </span>
            </div>

            <div className="bg-slate-50/50 outline outline-1 rounded-sm outline-slate-400 p-4 mt-7 space-y-3">
              <h3 className="text-slate-500 font-semibold">Autorizações</h3>
              <div>
                <p className="text-slate-500 mb-2">É administrador?</p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <InputRadio
                    text="Não"
                    icon={<PersonOffRounded />}
                    name="is_admin"
                    value="is_admin"
                    checked={currentUser.is_admin === false}
                    onChange={() => handleIsAdmin(false)}
                  />
                  <InputRadio
                    text="Sim"
                    icon={<HowToRegRounded />}
                    name="is_admin"
                    value="is_admin"
                    checked={currentUser.is_admin === true}
                    onChange={() => handleIsAdmin(true)}
                  />
                </div>

                {currentUser.is_admin ? (
                  <>
                    <p className="text-slate-500 mb-2">
                      Possui permissão permanente?
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <InputRadio
                        text="Não"
                        icon={<PersonOffRounded />}
                        name="is_fixed_admin"
                        value="is_fixed_admin"
                        checked={is_fixed_admin === false}
                        onChange={() => handleFixedAdmin(false)}
                      />
                      <InputRadio
                        text="Sim"
                        icon={<HowToRegRounded />}
                        name="is_fixed_admin"
                        value="is_fixed_admin"
                        checked={is_fixed_admin === true}
                        onChange={() => handleFixedAdmin(true)}
                      />
                    </div>

                    {!is_fixed_admin ? (
                      <>
                        <p className="text-slate-500 mb-2">
                          Informe o período de autorização:
                        </p>
                        {handleInvalidDatesAdmin() ? (
                          <>
                            <span className="text-sm text-red-900">
                              A data de fim precisa ser após a data de início.
                            </span>
                          </>
                        ) : (
                          <></>
                        )}
                        <div className="grid md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <span className="text-sm text-slate-500">
                              Início
                            </span>
                            <input
                              onChange={(e) =>
                                handleChangeStartAdmin(
                                  e.target.value.toString()
                                )
                              }
                              className="w-full mt-0 py-2 px-2 text-slate-400 outline outline-1 outline-slate-400 rounded-sm flex justify-between transition-colors"
                              type="date"
                              name="start_admin"
                              id="start_admin"
                              value={
                                currentUser.start_admin
                                  ? currentUser.start_admin
                                  : ""
                              }
                            />
                          </div>
                          <div>
                            <span
                              className={`text-sm  ${
                                currentUser.end_admin != null &&
                                handleInvalidDatesAdmin()
                                  ? "text-red-900"
                                  : "text-slate-500"
                              }`}
                            >
                              Fim
                            </span>
                            <input
                              onChange={(e) =>
                                handleChangeEndAdmin(e.target.value.toString())
                              }
                              className={`w-full mt-0 py-2 px-2 outline outline-1 rounded-sm flex justify-between transition-colors ${
                                currentUser.end_admin != null &&
                                handleInvalidDatesAdmin()
                                  ? "text-red-900 outline-red-900"
                                  : "text-slate-400 outline-slate-400"
                              }`}
                              type="date"
                              name="end_admin"
                              id="end_admin"
                              value={
                                currentUser.end_admin
                                  ? currentUser.end_admin
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <br />
            <br />

            <div className="bg-red-400/10 outline outline-1 rounded-sm outline-red-900 p-4 mt-7 space-y-3">
              <h3 className="text-red-900 font-semibold">
                Confirmar alterações
              </h3>

              <InputText
                text="Senha do administrador"
                icon={<PasswordRounded />}
                placeholder="Confirme sua senha"
                type="password"
                onChange={(e) => setAdminPassword(e.target.value)}
                value={admin_password}
                color="red"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => handleSave()}
                className="bg-blue-900 text-white mt-5 px-6 py-2 w-[70%] rounded-sm hover:bg-blue-950 transition-colors"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
