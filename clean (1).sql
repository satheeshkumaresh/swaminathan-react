-- Disable foreign key checks
SET foreign_key_checks = 0;

-- Truncate the tables
TRUNCATE TABLE customer_entity;
TRUNCATE TABLE customer_address_entity;
TRUNCATE TABLE customer_grid_flat;
TRUNCATE TABLE customer_entity_datetime;
TRUNCATE TABLE customer_entity_int;
TRUNCATE TABLE customer_entity_text;
TRUNCATE TABLE customer_entity_varchar;
TRUNCATE TABLE customer_address_entity_datetime;
TRUNCATE TABLE customer_address_entity_int;
TRUNCATE TABLE customer_address_entity_text;
TRUNCATE TABLE customer_address_entity_varchar;
TRUNCATE TABLE customer_log;
TRUNCATE TABLE persistent_session;
TRUNCATE TABLE wishlist;
TRUNCATE TABLE wishlist_item;
TRUNCATE TABLE sales_order;
TRUNCATE TABLE sales_order_grid;
TRUNCATE TABLE sales_order_item;
TRUNCATE TABLE sales_order_address;
TRUNCATE TABLE sales_order_tax;
TRUNCATE TABLE sales_order_payment;
TRUNCATE TABLE sales_order_status_history;
TRUNCATE TABLE quote;
TRUNCATE TABLE quote_address;
TRUNCATE TABLE quote_item;
TRUNCATE TABLE quote_payment;
TRUNCATE TABLE quote_shipping_rate;
TRUNCATE TABLE sales_invoice;
TRUNCATE TABLE sales_invoice_grid;
TRUNCATE TABLE sales_invoice_item;
TRUNCATE TABLE sales_shipment;
TRUNCATE TABLE sales_shipment_grid;
TRUNCATE TABLE sales_shipment_item;
TRUNCATE TABLE sales_creditmemo;
TRUNCATE TABLE sales_creditmemo_grid;
TRUNCATE TABLE sales_creditmemo_item;
TRUNCATE TABLE paypal_billing_agreement;
TRUNCATE TABLE paypal_billing_agreement_order;
TRUNCATE TABLE vault_payment_token;
TRUNCATE TABLE report_event;
TRUNCATE TABLE report_compared_product_index;
TRUNCATE TABLE report_viewed_product_index;
TRUNCATE TABLE cron_schedule;
TRUNCATE TABLE reporting_users;
TRUNCATE TABLE admin_user_session;
TRUNCATE TABLE session;
TRUNCATE TABLE search_query;
TRUNCATE TABLE search_synonyms;
TRUNCATE TABLE newsletter_subscriber;
TRUNCATE TABLE salesrule_coupon_usage;
TRUNCATE TABLE salesrule_customer;
TRUNCATE TABLE gift_message;
TRUNCATE TABLE downloadable_link_purchased;
TRUNCATE TABLE downloadable_link_purchased_item;
TRUNCATE TABLE mailchimp_webhook_request;

-- Re-enable foreign key checks
SET foreign_key_checks = 1;

