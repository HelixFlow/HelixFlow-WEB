import { request } from 'umi';
import {
  ASSET_DDL_PARSE,
  ASSET_TABLES,
  KNOWLEDGE_INGEST,
  BUSINESS_ANALYSIS_RUNS,
} from '@/constants/api';

export async function parseDDL(data) {
  return request(ASSET_DDL_PARSE, {
    method: 'POST',
    data,
  });
}

export async function getTableAssets(params = {}) {
  return request(ASSET_TABLES, {
    method: 'GET',
    params,
  });
}

export async function createTableAsset(data) {
  return request(ASSET_TABLES, {
    method: 'POST',
    data,
  });
}

export async function updateTableAsset(id, data) {
  return request(`${ASSET_TABLES}/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteTableAsset(id) {
  return request(`${ASSET_TABLES}/${id}`, {
    method: 'DELETE',
  });
}

export async function ingestKnowledge(data) {
  return request(KNOWLEDGE_INGEST, {
    method: 'POST',
    data,
  });
}

export async function createBusinessAnalysisRun(data) {
  return request(BUSINESS_ANALYSIS_RUNS, {
    method: 'POST',
    data,
  });
}

export async function getBusinessAnalysisRun(runId) {
  return request(`${BUSINESS_ANALYSIS_RUNS}/${runId}`, {
    method: 'GET',
  });
}

export async function selectBusinessAnalysisTables(runId, data) {
  return request(`${BUSINESS_ANALYSIS_RUNS}/${runId}/select-tables`, {
    method: 'POST',
    data,
  });
}
