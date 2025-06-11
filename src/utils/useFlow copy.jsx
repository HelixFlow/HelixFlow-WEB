import React, { useEffect, useState, useContext } from 'react'
import { SystemContext } from '@/components/CusProvider';
import { getFlowList, getNodeList } from '@/services/Flow';

export default function useFlowDraw() {
  const {
    setTypes,
    setTemplates,
    setAllNodes,
    setFlows,
  } = useContext(SystemContext)

  useEffect(() => {
    getFlowList().then(res => {

      setFlows(Object.values(res.data)?.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.id]: curr,
        };
      }, {})
      )
    })
    getNodeList().then(result => {
      result.data = { ...result };
      setAllNodes(result.data);
      setTemplates(
        Object.values(result.data).reduce((acc, curr) => {
          return {
            ...acc,
            ...curr,
          };
        }, {})
      );
      // Set the types by reducing over the keys of the result data and updating the accumulator.
      setTypes(
        // Reverse the keys so the tool world does not overlap
        Object.keys(result.data)
          .reverse()
          .reduce((acc, curr) => {
            let currData = result.data[curr];
            Object.keys(currData).forEach(
              (c) => {
                let cData = currData[c];
                acc[c] = curr;
                // Add the base classes to the accumulator as well.
                cData?.base_classes?.forEach((b) => {
                  acc[b] = curr;
                });
              }
            );
            return acc;
          }, {})
      );
    })
    return () => {
      setTypes({})
      setTemplates({})
      setAllNodes({})
      setFlows({})
    }
  }, [])



}