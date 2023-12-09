import { Switch } from "@mantine/core";
import React, { useState } from "react";

function EnableTowFactor() {
  const [towFactor, setTowFactor] = useState(false);


    const handleTowFactor = () => {
        if (!towFactor) {
            // handle enable it
        }
        else {
            // handle disable it
        }
        setTowFactor(!towFactor);
  };

  return(
        <Switch
            checked={towFactor}
            label="enable tow factor authontacation"
            onChange={handleTowFactor}
        />
  );
}

export default EnableTowFactor