import { useState } from 'react';

function useBoolean(initState=false) {
  const [state, setBooleanState] = useState<boolean>(initState);
  const toggle = () => setBooleanState(!state);
  return [state, setBooleanState, toggle] as const;
}

export default useBoolean;