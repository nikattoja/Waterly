import { ApiResponse, get, post, put } from "./api";
import { GetPagedListDto, PaginatedList } from "./accountApi";

const WATERMETERS_PATH = "/water-meters";

export interface GetPagedWaterMetersListDto {
  order: string;
  page: number;
  pageSize: number;
  orderBy: string;
}

export interface WaterMeterDto {
  id: number;
  active: boolean;
  serialNumber: string;
  expiryDate: string;
  expectedDailyUsage: number;
  startingValue: number;
  type: string;
  apartmentId: number;
  version: number;
}

export interface CreateMainWaterMeterDto {
  expiryDate: Date;
  startingValue: number;
}

export interface ReplaceMainWaterMeterDto {
  expiryDate: Date;
  startingValue: number;
}

export interface WaterMeterActiveStatusDto {
  active: boolean;
}

export interface List<T> {
  data: T[];
}

export interface WaterMeterChecksDto {
  checkDate: Date;
  managerAuthored: boolean;
  waterMeterChecks: WaterMeterCheckDto[];
}

export interface WaterMeterCheckDto {
  waterMeterId: number;
  reading: string;
}

export async function getWaterMeterById(
  id: number
): Promise<ApiResponse<WaterMeterDto>> {
  return get(`${WATERMETERS_PATH}/${id}`);
}

export async function getWaterMetersList(
  getPagedListDto: GetPagedListDto,
  pattern: string
): Promise<ApiResponse<PaginatedList<WaterMeterDto>>> {
  return get(`${WATERMETERS_PATH}`, { ...getPagedListDto, pattern: pattern });
}

export async function changeWaterMeterActiveStatus(
  waterMeterId: string,
  body: WaterMeterActiveStatusDto
) {
  return put(`${WATERMETERS_PATH}/${waterMeterId}/active`, body);
}

export async function updateWaterMeter(
  id: number,
  updatedWaterMeter: WaterMeterDto,
  etag: string
) {
  return put(`${WATERMETERS_PATH}/${id}`, updatedWaterMeter, {
    "If-Match": etag,
  });
}

export async function createMainWaterMeter(body: CreateMainWaterMeterDto) {
  return post(`${WATERMETERS_PATH}/main-water-meter`, body);
}

export async function replaceMainWaterMeter(
  id: number,
  body: ReplaceMainWaterMeterDto
) {
  return post(`${WATERMETERS_PATH}/${id}/replace`, body);
}

export async function getApartmentWaterMeters(
  apartmentId: number
): Promise<ApiResponse<WaterMeterDto[]>> {
  return get(`${WATERMETERS_PATH}/apartment/${apartmentId}`);
}

export async function performWaterMeterChecks(
  waterMeterChecksDto: WaterMeterChecksDto
) {
  return post(`${WATERMETERS_PATH}/water-meter-checks`, waterMeterChecksDto);
}

export async function getWaterMatersByApartmentId(
  apartmentId: number
): Promise<ApiResponse<WaterMeterDto[]>> {
  return get(`${WATERMETERS_PATH}/apartment/${apartmentId}`);
}
