import { useContractWrite, useSignTypedData } from "wagmi";
import artifacts from "../utils/contract.json";
import { domain, types } from "../utils/EIP712";

const WRITE_ASYNC_OVERRIDES_GASLIMIT = { gasLimit: 250_000 };

/* STEP #2
    TODO: Develop the logic to sign typed data with connected account
    TIPS: There is a hook from the wagmi documentation that allows you to do a 712 signature
    Link of the documentation: https://wagmi.sh/docs/getting-started
*/

/* STEP #3
    TODO: Develop the logic to post a message
    TIPS: There is a hook from the wagmi documentation that allows you to call a write method
    Link of the documentation: https://wagmi.sh/docs/getting-started
*/
const usePostMessage = () => {
  // Implement the logic to sign typed data with connected account
  const { data, isError, isLoading, isSuccess, error, writeAsync } = useContractWrite({
    addressOrName: domain.verifyingContract,
    contractInterface: artifacts.abi,
    functionName: 'sendMessage',
  });
  const { isError: is712Error, isSuccess: is712Success, error: error712, signTypedDataAsync } = useSignTypedData();

  const postMessage = async (message: string, author: string) => {
    try {
      const value = { contents: message, from: author };
      const signature = await signTypedDataAsync({ value, domain, types });
      console.log({ signature })
      const tx = await writeAsync({ args: [message, signature], overrides: WRITE_ASYNC_OVERRIDES_GASLIMIT, });
      console.log(`tx hash: ${tx?.hash}`);
    } catch (e) {
      throw new Error(e);
    }
  };

  return {
    postMessage,
    data,
    error: error || error712,
    isError: isError || is712Error,
    isLoading: isLoading || isLoading,
    isSuccess: isSuccess && is712Success
  };
};

export default usePostMessage;
