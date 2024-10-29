import { useState } from "react";
import { X } from "lucide-react";

import * as Dialog from "@radix-ui/react-dialog";
import { DeleteRounded } from "@mui/icons-material";
import { toast } from "sonner";

import { Environment, deleteEnv } from "../../../services/environment.service.ts";

interface DeleteEnvDialogParamns {
    env: Environment;
    onSucess: () => {};
}

export function DeleteEnvDialog({ env, onSucess }: DeleteEnvDialogParamns) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);

    const handleConfirmDelete = async () => {
        try {
            const deleteParams = {
                envId: env.id,
            };

            console.log(deleteParams)

            if (deleteParams.envId) {
                await deleteEnv(deleteParams.envId);
            }

            setShouldShowOnboarding(false);
            onSucess();
            toast.success("Ambiente excluído com sucesso");
        } catch (error) {
            toast.error("Erro na exclusão do ambiente");
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

                        <p className="text-justify text-slate-700">Ao confirmar você irá exluir o ambiente <span className="font-semibold">{env.name}</span>, que possui <span className="font-semibold">{env.numberOfStations} estações</span> e cuja sigla é <span className="font-semibold">{env.abbreviation}</span>. Continuar?</p>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="bg-red-900 text-white mt-5 px-6 py-2 w-[70%] rounded-sm hover:bg-red-950 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>)
                : <></>}

        </Dialog.Root>
    );
}