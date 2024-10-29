import { useEffect, useState } from "react";
import { X } from "lucide-react";

import * as Dialog from "@radix-ui/react-dialog";
import { ThumbDownAltRounded, ThumbUpAltRounded } from "@mui/icons-material";
import { toast } from "sonner";
import {
  AcceptReqParams,
  DeclineReqParams,
  RequestSchedule,
  acceptRequestSchedule,
  declineRequestSchedule,
} from "../../../services/request-environment.service";

interface AcceptequestDialogParamns {
  sch: RequestSchedule;
  onSucess: () => {};
}

export function AcceptRequestDialog({
  sch,
  onSucess,
}: AcceptequestDialogParamns) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);

  const [updateParams, setUpdateParams] = useState<AcceptReqParams>({
    id: sch.id,
  });

  const handleAcceptRequest = async () => {
    try {
      console.log(updateParams);
      await acceptRequestSchedule(updateParams);

      onSucess();

      toast.success("Solicitação confirmada com sucesso");
    } catch (error) {
      toast.error("Erro ao confirmar solicitação");
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <span className="text-slate-500 bg-transparent p-2 flex items-center justify-center rounded-full hover:bg-slate-100">
          <ThumbUpAltRounded />
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
              Confirmar solicitação de agendamento
            </h3>

            <p className="text-justify text-slate-700">
              Ao confirmar você irá confirmar a solicitação{" "}
              <span className="font-semibold">{sch.description}</span>.
            </p>

            <p>Continuar?</p>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAcceptRequest}
                className={`bg-green-900 hover:bg-green-950 text-white mt-5 px-6 py-2 w-[70%] rounded-sm transition-colors`}
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
