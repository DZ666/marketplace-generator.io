// Exchange names
export const AUTH_SERVICE_EXCHANGE = 'auth_exchange';
export const USER_SERVICE_EXCHANGE = 'user_exchange';
export const PRODUCT_SERVICE_EXCHANGE = 'product_exchange';
export const ORDER_SERVICE_EXCHANGE = 'order_exchange';

// Queue names
export const AUTH_SERVICE_QUEUE = 'auth_service_queue';
export const AUTH_VALIDATE_QUEUE = 'auth_validate_queue';
export const AUTH_USER_CREATED_QUEUE = 'auth_user_created_queue';

export const USER_SERVICE_QUEUE = 'user_service_queue';
export const USER_ORDERS_QUEUE = 'user_orders_queue';

export const PRODUCT_SERVICE_QUEUE = 'product_service_queue';
export const PRODUCT_ORDERS_QUEUE = 'product_orders_queue';

export const ORDER_SERVICE_QUEUE = 'order_service_queue';
export const ORDER_USER_VALIDATION_QUEUE = 'order_user_validation_queue';
export const ORDER_PRODUCT_CHECK_QUEUE = 'order_product_check_queue';

// Patterns (routing keys)
export const VALIDATE_USER_PATTERN = 'validate_user';
export const USER_CREATED_PATTERN = 'user_created';
export const USER_UPDATED_PATTERN = 'user_updated';
export const PRODUCT_CREATED_PATTERN = 'product_created';
export const PRODUCT_UPDATED_PATTERN = 'product_updated';
export const ORDER_CREATED_PATTERN = 'order_created';
export const ORDER_UPDATED_PATTERN = 'order_updated'; 