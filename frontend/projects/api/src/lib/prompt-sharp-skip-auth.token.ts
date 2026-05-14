import { HttpContextToken } from '@angular/common/http';

export const PROMPT_SHARP_SKIP_AUTH = new HttpContextToken<boolean>(() => false);
