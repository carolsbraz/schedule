import { useEffect, useState } from "react";
import { X } from "lucide-react";

import * as Dialog from "@radix-ui/react-dialog";
import { ThumbDownAltRounded } from "@mui/icons-material";
import { toast } from "sonner";
import {
  DeclineReqParams,
  RequestSchedule,
  declineRequestSchedule,
} from "../../../services/request-environment.service";

interface DeclineRequestDialogParamns {
  sch: RequestSchedule;
  onSucess: () => {};
}

export function DeclineRequestDialog({
  sch,
  onSucess,
}: DeclineRequestDialogParamns) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);

  const [updateParams, setUpdateParams] = useState<DeclineReqParams>({
    id: sch.id,
    comment: "",
  });

  function handleChangeComment(newComment: string) {
    setUpdateParams((prevRequest) => ({ ...prevRequest, comment: newComment }));
  }

  const handleDeclineRequest = async () => {
    try {
      console.log(updateParams);
      await declineRequestSchedule(updateParams);

      onSucess();

      toast.success("Solicitação recusada com sucesso");
    } catch (error) {
      toast.error("Erro ao recusar solicitação");
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <span className="text-slate-500 bg-transparent p-2 flex items-center justify-center rounded-full hover:bg-slate-100">
          <ThumbDownAltRounded />
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
              Rejeitar solicitação de agendamento
            </h3>

            <p className="text-justify text-slate-700">
              Ao confirmar você irá rejeitar a solicitação{" "}
              <span className="font-semibold">{sch.description}</span>.
            </p>

            <p>Continuar?</p>

            <div>
              <textarea
                name="comment"
                id="comment"
                placeholder="Informe o motivo da rejeição da solicitação"
                onChange={(e) => handleChangeComment(e.target.value)}
                value={updateParams.comment}
                className="w-full mt-2 py-2 pl-3 pr-4 outline outline-1 rounded-sm flex justify-between transition-colors hover:cursor-text outline-slate-300"
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleDeclineRequest}
                className={`${
                  updateParams.comment != ""
                    ? "bg-red-900 hover:bg-red-950"
                    : "bg-red-100"
                } text-white mt-5 px-6 py-2 w-[70%] rounded-sm transition-colors`}
                disabled={updateParams.comment != "" ? false : true}
              >
                Confirmar
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      ) : (
        <></>
      )}
    </Dialog.Root>
  );
}
