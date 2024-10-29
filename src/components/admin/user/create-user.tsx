import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { InputText } from "../../input-text.tsx";
import { InputRadio } from "../../input-radio.tsx";

import {
  PersonRounded,
  Grid3x3Rounded,
  EmailRounded,
  PasswordRounded,
  SchoolRounded,
  ClassRounded,
  WorkRounded,
  PersonOffRounded,
  HowToRegRounded,
  PersonAddAltRounded,
} from "@mui/icons-material";
import { toast } from "sonner";
import { CreateUser } from "../../../services/users.service.ts";

interface CreateUserDialogParamns {
  onSucess: () => {};
}

export function CreateUserDialog({ onSucess }: CreateUserDialogParamns) {
  const [is_fixed_admin, setIsFixedAdmin] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    institucional_id: "",
    email: "",
    password: "",
    role: "undergraduated",
    authenticated: false,
    is_admin: false,
    start_admin: "",
    end_admin: "",
  });

  function handleChangeName(newName: string) {
    setNewUser((prevUser) => ({ ...prevUser, name: newName }));
  }

  function handleChangeInstitucionalId(newInstitucionalId: string) {
    setNewUser((prevUser) => ({
      ...prevUser,
      institucional_id: newInstitucionalId,
    }));
  }

  function handleChangeEmail(newEmail: string) {
    setNewUser((prevUser) => ({ ...prevUser, email: newEmail }));
  }

  function handleChangePassword(newPassword: string) {
    setNewUser((prevUser) => ({ ...prevUser, password: newPassword }));
  }

  function handleChangeRole(newRole: string) {
    setNewUser((prevUser) => ({ ...prevUser, role: newRole }));
  }

  function handleChangeIsAdmin(newIsAdmin: boolean) {
    setNewUser((prevUser) => ({ ...prevUser, is_admin: newIsAdmin }));
  }

  function handleChangeStartAdmin(newStartAdmin: string) {
    setNewUser((prevUser) => ({
      ...prevUser,
      start_admin: newStartAdmin,
    }));
  }

  function handleChangeEndAdmin(newEndAdmin: string) {
    setNewUser((prevUser) => ({ ...prevUser, end_admin: newEndAdmin }));
  }

  const handleInvalidDatesAdmin = () => {
    if (newUser.start_admin != null && newUser.end_admin != null) {
      const start = new Date(newUser.start_admin);
      const end = new Date(newUser.end_admin);
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
      await CreateUser(
        newUser.name,
        newUser.institucional_id,
        newUser.email,
        newUser.password,
        newUser.role,
        newUser.is_admin,
        newUser.start_admin,
        newUser.end_admin
      );
      handleChangeName("");
      handleChangeInstitucionalId("");
      handleChangeEmail("");
      handleChangePassword("");
      handleChangeRole("undergraduated");
      handleChangeIsAdmin(false);
      setIsFixedAdmin(false);
      handleChangeStartAdmin("");
      handleChangeEndAdmin("");
      toast.success("Usuário criado com sucesso");
      onSucess();
    } catch (error) {
      console.error(error);
      toast.error(
        "Erro ao criar usuário. Verifique suas credenciais e tente novamente."
      );
    }
  };

  function handleOpenChange() {
    handleChangeName("");
    handleChangeInstitucionalId("");
    handleChangeEmail("");
    handleChangePassword("");
    handleChangeRole("undergraduated");
    handleChangeIsAdmin(false);
    setIsFixedAdmin(false);
    handleChangeStartAdmin("");
    handleChangeEndAdmin("");
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <span className="text-slate-500 bg-slate-200 p-3 flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors rounded-sm">
          <PersonAddAltRounded /> Cadastro de usuário
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden overflow-y-auto inset-0 md:inset-auto md:right-0 md:top-0 md:max-w-[640px] py-10 px-10 w-full md:h-full bg-white flex flex-col outline-none">
          <Dialog.Close className="absolute top-9 right-9 p-1.5 text-slate-500 hover:text-slate-400">
            <X className="size-5 " />
          </Dialog.Close>

          <h3 className="text-2xl font-semibold text-slate-500 mb-10">
            Cadastrar novo usuário
          </h3>

          <form className="flex-1 flex flex-col">
            <div className="grid md:grid-cols-3 gap-4 w-full mb-2">
              <InputRadio
                text="Discente"
                icon={<SchoolRounded />}
                name="role"
                value="undergraduated"
                checked={newUser.role === "undergraduated"}
                onChange={() => handleChangeRole("undergraduated")}
              />
              <InputRadio
                text="Docente"
                icon={<ClassRounded />}
                name="role"
                value="teacher"
                checked={newUser.role === "teacher"}
                onChange={() => handleChangeRole("teacher")}
              />
              <InputRadio
                text="Técnico"
                icon={<WorkRounded />}
                name="role"
                value="technic"
                checked={newUser.role === "technic"}
                onChange={() => handleChangeRole("technic")}
              />
            </div>
            <InputText
              text="Nome"
              icon={<PersonRounded />}
              placeholder="Nome"
              type="text"
              onChange={(e) => handleChangeName(e.target.value)}
              value={newUser.name}
            />
            <InputText
              text={newUser.role == "undergraduated" ? "Matrícula" : "SIAPE"}
              icon={<Grid3x3Rounded />}
              placeholder={
                newUser.role == "undergraduated" ? "Matrícula" : "SIAPE"
              }
              type="string"
              onChange={(e) => handleChangeInstitucionalId(e.target.value)}
              value={newUser.institucional_id}
            />
            <InputText
              text="Email"
              icon={<EmailRounded />}
              placeholder="Email"
              type="email"
              onChange={(e) => handleChangeEmail(e.target.value)}
              value={newUser.email}
            />

            <InputText
              text="Senha"
              icon={<PasswordRounded />}
              placeholder="Senha"
              type="password"
              onChange={(e) => handleChangePassword(e.target.value)}
              value={newUser.password}
            />

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
                    checked={newUser.is_admin === false}
                    onChange={() => handleIsAdmin(false)}
                  />
                  <InputRadio
                    text="Sim"
                    icon={<HowToRegRounded />}
                    name="is_admin"
                    value="is_admin"
                    checked={newUser.is_admin === true}
                    onChange={() => handleIsAdmin(true)}
                  />
                </div>

                {newUser.is_admin ? (
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
                                newUser.start_admin ? newUser.start_admin : ""
                              }
                            />
                          </div>
                          <div>
                            <span
                              className={`text-sm  ${
                                newUser.end_admin != null &&
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
                                newUser.end_admin != null &&
                                handleInvalidDatesAdmin()
                                  ? "text-red-900 outline-red-900"
                                  : "text-slate-400 outline-slate-400"
                              }`}
                              type="date"
                              name="end_admin"
                              id="end_admin"
                              value={newUser.end_admin ? newUser.end_admin : ""}
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
