/**
 * Modelo de funcionário do sistema
 */
import { User } from './user.model';

export interface Employee extends User {
  phone: string;
  department: string;
  position: string;
}