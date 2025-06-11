import React, { useEffect, useState, useContext } from 'react'
import { SystemContext } from '@/components/CusProvider';

//cookie
export const CookieUse = () => {
  return {
    setCookie: (name, value) => {
      let Days = 1;
      let exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
    },
    getCookie: (name) => {
      let arr; let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
    }
  }
}

export const controlButton = ({ type, key, option }, props, rule = false) => {
  const { allBtns } = useContext(SystemContext)
  try {
    if (rule) {
      let secondType = rule.type;
      let secondKey = rule.key.toString();
      if (allBtns[secondType][secondKey]?.own) return props;
    }
    if (allBtns[type][key.toString()]) {
      return props;
    } else {
      return '';
    }
    // return props;
  } catch (error) {

    return '';
  }
}

//uuid
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(
      16,
    );
  });
}

// 链接是否有效
export function isValidConnection(
  { source, target, sourceHandle, targetHandle },
  reactFlowInstance
) {
  if (
    targetHandle
      .split("|")[0]
      .split(";")
      .some((n) => n === sourceHandle.split("|")[0]) ||
    sourceHandle
      .split("|")
      .slice(2)
      .some((t) =>
        targetHandle
          .split("|")[0]
          .split(";")
          .some((n) => n === t)
      ) ||
    targetHandle.split("|")[0] === "str"
  ) {
    let targetNode = reactFlowInstance?.getNode(target)?.data?.node;
    if (!targetNode) {
      if (
        !reactFlowInstance
          .getEdges()
          .find((e) => e.targetHandle === targetHandle)
      ) {
        return true;
      }
    } else if (
      (!targetNode.template[targetHandle.split("|")[1]].list &&
        !reactFlowInstance
          .getEdges()
          .find((e) => e.targetHandle === targetHandle)) ||
      targetNode.template[targetHandle.split("|")[1]].list
    ) {
      return true;
    }
  }
  return false;
}

export function toNormalCase(str) {
  let result = str
    .split("_")
    .map((word, index) => {
      if (index === 0) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(" ");

  return result
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(" ");
}

export function validateNode(
  n,
  edges
) {
  //必填项
  const { display_name,input,output,params,name } = n.data;
  let data = [...(input || []), ...(output || []), ...(params || [])];
  let required = data.filter((item) => item.required === true);
  let errors = [];
  required.forEach((item) => {
    if(item.field_type == 'condition'){
      if(item.display_name !== 'else'){
        if(item.value.reference === null || item.value.reference === undefined || item.value.reference === '') {
          errors.push(`${display_name} 缺失了 ${toNormalCase(item.display_name)} 的引用值.`)
        }
        if(item.value.compare === null || item.value.compare === undefined || item.value.compare === '') {
          errors.push(`${display_name} 缺失了 ${toNormalCase(item.display_name)} 的比较符.`)
        }
        if(!['is empty','is not empty'].includes(item.value.compare)  && (item.value.compare_value === null || item.value.compare_value === undefined || item.value.compare_value === '')) {
          errors.push(`${display_name} 缺失了 ${toNormalCase(item.display_name)} 的比较值.`)
        }
      }

    }else if(item.value === null || item.value === undefined || item.value === '') {
      errors.push(`${display_name} 缺失了 ${toNormalCase(item.display_name)}.`)
    }
  })
  if(name == 'start'){
    if(edges.filter(item => item.source == display_name).length == 0){
      errors.push(`${display_name} 缺失了连接.`)
    }
  }else if(name == 'end'){
    if(edges.filter(item => item.target == display_name).length == 0){
      errors.push(`${display_name} 缺失了连接.`)
    }
  }else if(name == "if_condition"){
    if(edges.filter(item => item.target == display_name).length == 0){
      errors.push(`${display_name} 缺失了连接.`)
    }
    params.forEach((param) => {
      if(edges.filter(item => item.source == display_name && item.sourceHandle == param.display_name).length == 0){
        errors.push(`${display_name} 缺失了 ${toNormalCase(param.display_name)} 的连接.`)
      }
    })
  }else{
    if(edges.filter(item => item.source == display_name).length == 0 || edges.filter(item => item.target == display_name).length == 0){
      errors.push(`${display_name} 缺失了连接.`)
    }
  }
  return errors;
}

export function validateNodes(reactFlowInstance) {
  let edges = reactFlowInstance.getEdges();
  let nodes = reactFlowInstance.getNodes();
  if (nodes.length === 0) {
    return [
      "流程中未发现节点。请在流程中至少添加一个节点。",
    ];
  }
  console.log(reactFlowInstance,edges,nodes)
  return nodes.flatMap((n) => validateNode(n, edges));
}

//关联节点
export function groupByFamily(data, baseClasses, left, type) {
  let parentOutput;
  let arrOfParent = [];
  let arrOfType = [];
  let arrOfLength = [];
  let lastType = "";
  Object.keys(data).map((d) => {
    Object.keys(data[d]).map((n) => {
      try {
        if (
          data[d][n].base_classes?.some((r) =>
            baseClasses.split("\n").includes(r)
          )
        ) {
          arrOfParent.push(d);
        }
        if (n === type) {
          parentOutput = d;
        }

        if (d !== lastType) {
          arrOfLength.push({
            length: Object.keys(data[d]).length,
            type: d,
          });

          lastType = d;
        }
      } catch (e) {
        // console.log(e);
      }
    });
  });

  Object.keys(data).map((d) => {
    Object.keys(data[d]).map((n) => {
      try {
        baseClasses.split("\n").forEach((tol) => {
          data[d][n].base_classes?.forEach((data) => {
            if (tol == data) {
              arrOfType.push({
                family: d,
                type: data,
                component: n,
              });
            }
          });
        });
      } catch (e) {
        // console.log(e);
      }
    });
  });

  if (left === false) {
    let groupedBy = arrOfType.filter((object, index, self) => {
      const foundIndex = self.findIndex(
        (o) => o.family === object.family && o.type === object.type
      );
      return foundIndex === index;
    });

    return groupedBy.reduce((result, item) => {
      const existingGroup = result.find(
        (group) => group.family === item.family
      );

      if (existingGroup) {
        existingGroup.type += `, ${item.type}`;
      } else {
        result.push({
          family: item.family,
          type: item.type,
          component: item.component,
        });
      }

      if (left === false) {
        let resFil = result.filter((group) => group.family === parentOutput);
        result = resFil;
      }

      return result;
    }, []);
  } else {
    const groupedArray = [];
    const groupedData = {};

    arrOfType.forEach((item) => {
      const { family, type, component } = item;
      const key = `${family}-${type}`;

      if (!groupedData[key]) {
        groupedData[key] = { family, type, component: [component] };
      } else {
        groupedData[key].component.push(component);
      }
    });

    for (const key in groupedData) {
      groupedArray.push(groupedData[key]);
    }

    groupedArray.forEach((object, index, self) => {
      const findObj = arrOfLength.find((x) => x.type === object.family);
      if (object.component.length === findObj.length) {
        self[index]["type"] = "";
      } else {
        self[index]["type"] = object.component.join(", ");
      }
    });
    return groupedArray;
  }
}

//大写标题
export const upperCaseWords = ["llm", "uri"];
export function checkUpperWords(str) {
  const words = str.split(" ").map((word) => {
    return upperCaseWords.includes(word.toLowerCase())
      ? word.toUpperCase()
      : word[0].toUpperCase() + word.slice(1).toLowerCase();
  });

  return words.join(" ");
}

export function toTitleCase(str) {
  let result = str
  //   .split("_")
  //   .map((word, index) => {
  //     if (index === 0) {
  //       return checkUpperWords(
  //         word[0].toUpperCase() + word.slice(1).toLowerCase()
  //       );
  //     }
  //     return checkUpperWords(word.toLowerCase());
  //   })
  //   .join(" ");
  // console.log(result)

  return result
    .split("_")
    .map((word, index) => {
      if (index === 0) {
        return checkUpperWords(
          word[0].toUpperCase() + word.slice(1).toLowerCase()
        );
      }
      return checkUpperWords(word.toLowerCase());
    })
    .join("_");
}

export function visibilityText(val) {
  const text = val.toString();
  const len = text.length;
  return '*****' + text.substring(5, len);
}



//模型管理
export const arrToObj = (arr, obj = {}) => {
  arr.forEach(item => {
    obj[item.name] = { type: item.type, value: item.value }
  })
  return obj;
}

export const objToArr = (obj, arr = []) => {
  for (let key in obj) {
    const newObj = {};
    newObj.name = key;
    newObj.type = obj[key].type;
    newObj.value = obj[key].value;
    arr.push(newObj);
  }
  return arr;
}
