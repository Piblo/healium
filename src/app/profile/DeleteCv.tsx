import { CandidateProfileOutput, trpc } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";

export const DeleteCv = () => {
  const queryClient = useQueryClient();
  const mutation = trpc.candidate.deleteCv.useMutation({
    onSuccess: () => {
      const key = getQueryKey(trpc.candidate.profile, undefined, "query");
      queryClient.setQueryData<CandidateProfileOutput>(key, (oldData) => {
        return {
          ...oldData,
          isCvUploaded: false,
          cvFileName: null,
          cvUrl: null,
        };
      });
    },
  });

  return (
    <Button
      variant="secondary"
      className="self-start"
      loading={mutation.isLoading}
      onClick={() => mutation.mutate()}
    >
      Borrar CV
    </Button>
  );
};
