import { useState } from "react";
import { X } from "lucide-react";

import * as Dialog from "@radix-ui/react-dialog";
import { DeleteRounded, PasswordRounded } from "@mui/icons-material";
import { toast } from "sonner";

import { User, deleteUser } from "../../../services/users.service.ts";
import { InputText } from "../../input-text";

interface DeleteUserDialogParamns {
  admin: User;
  user: User;
  onSucess: () => {};
}

export function DeleteUserDialog({
  admin,
  user,
  onSucess,
}: DeleteUserDialogParamns) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [adminPassword, setAdminPassword] = useState("");

  const handleConfirmDelete = async () => {
    try {
      const deleteParams = {
        adminId: admin.id || "",
        adminPassword,
        userId: user.id,
      };

      console.log(deleteParams);

      await deleteUser(
        deleteParams.adminId,
        deleteParams.adminPassword,
        deleteParams.userId || ""
      );

      setShouldShowOnboarding(false);
      onSucess();
      toast.success("Usuário excluído com sucesso");
    } catch (error) {
      toast.error("Erro na exclusão do usuário");
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <span className="text-slate-500 bg-transparent p-2 flex items-center justify-center rounded-full hover:bg-slate-100">
          <DeleteRounded />
        </span>
      </Dialog.Trigger>

      {shouldShowOnboarding ? (
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed bg-black/50" />
          <Dialog.Content className="fixed rounded-sm overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full py-10 px-10 bg-white flex flex-col outline-none">
            <Dialog.Close className="absolute top-9 right-9 p-1.5 text-slate-500 hover:text-slate-400">
              <X className="size-5 " />
            </Dialog.Close>

            <h3 className="text-2xl font-semibold text-slate-700 mb-10">
              Deletar usuário
            </h3>

            <p className="text-justify text-slate-700">
              Ao confirmar você irá exluir o usuário{" "}
              <span className="font-semibold">{user.name}</span>, cujo email
              cadastrado é: <span className="font-semibold">{user.email}</span>.
              Continuar?
            </p>

            <form className="flex-1 flex flex-col">
              <div className="bg-red-400/10 outline outline-1 rounded-sm outline-red-900 p-4 mt-7 space-y-3">
                <h3 className="text-red-900 font-semibold">
                  Confirmar alterações
                </h3>

                <InputText
                  text="Senha do administrador"
                  icon={<PasswordRounded />}
                  placeholder="Confirme sua senha"
                  type="password"
                  onChange={(e: any) => setAdminPassword(e.target.value)}
                  value={adminPassword}
                  color="red"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="bg-red-900 text-white mt-5 px-6 py-2 w-[70%] rounded-sm hover:bg-red-950 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      ) : (
        <></>
      )}
    </Dialog.Root>
  );
}
