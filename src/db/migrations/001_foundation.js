// Foundation schema (portable: no SQLite-only features). Admin features use these tables in Phase 2+.
exports.up = async (k) => {
  const id = (t) => t.increments('id');
  const ts = (t) => t.timestamp('created_at').defaultTo(k.fn.now());
  await k.schema.createTable('admin_users', t => { id(t); t.string('email').unique().notNullable(); t.string('password_hash').notNullable(); t.string('name'); ts(t); });
  await k.schema.createTable('customers', t => { id(t); t.string('company_name').notNullable(); t.string('contact_person').notNullable(); t.string('phone').notNullable(); t.string('whatsapp'); t.string('email'); t.string('city').notNullable(); t.text('address'); ts(t); });
  await k.schema.createTable('enquiries', t => { id(t); t.string('reference').unique().notNullable(); t.integer('customer_id').references('customers.id').notNullable();
    t.string('status').notNullable().defaultTo('New Enquiry'); t.string('product_type').notNullable();
    t.decimal('length'); t.decimal('width'); t.decimal('height'); t.string('unit'); t.string('material_ply'); t.text('printing'); t.string('print_colours');
    t.text('custom_requirements'); t.string('quantity'); t.string('timeline'); t.text('description'); t.string('contact_method'); ts(t); });
  await k.schema.createTable('enquiry_files', t => { id(t); t.integer('enquiry_id').references('enquiries.id').notNullable(); t.string('stored_name').notNullable(); t.string('original_name'); t.string('mime'); t.integer('size'); ts(t); });
  await k.schema.createTable('contact_messages', t => { id(t); t.string('name').notNullable(); t.string('phone'); t.string('email'); t.text('message').notNullable(); ts(t); });
  await k.schema.createTable('quotations', t => { id(t); t.integer('enquiry_id').references('enquiries.id').notNullable(); t.integer('revision').notNullable().defaultTo(1); t.decimal('amount'); t.text('terms'); t.string('status').defaultTo('Prepared'); ts(t); });
  await k.schema.createTable('samples', t => { id(t); t.integer('enquiry_id').references('enquiries.id').notNullable(); t.integer('version').notNullable().defaultTo(1); t.string('status').defaultTo('Sample Development'); t.text('feedback'); ts(t); });
  await k.schema.createTable('bulk_orders', t => { id(t); t.integer('enquiry_id').references('enquiries.id').notNullable(); t.integer('quotation_id').references('quotations.id').notNullable(); t.integer('sample_id').references('samples.id').notNullable(); t.string('quantity'); t.text('agreed_terms'); t.string('status').defaultTo('Bulk Order Confirmed'); ts(t); });
  await k.schema.createTable('production_updates', t => { id(t); t.integer('bulk_order_id').references('bulk_orders.id').notNullable(); t.string('stage'); t.text('note'); ts(t); });
  await k.schema.createTable('deliveries', t => { id(t); t.integer('bulk_order_id').references('bulk_orders.id').notNullable(); t.date('delivery_date'); t.text('note'); ts(t); });
  await k.schema.createTable('payments', t => { id(t); t.integer('bulk_order_id').references('bulk_orders.id').notNullable(); t.decimal('amount'); t.string('method'); t.date('paid_on'); t.text('note'); ts(t); });
  await k.schema.createTable('activity_log', t => { id(t); t.string('entity'); t.integer('entity_id'); t.string('action'); t.text('detail'); ts(t); });
};
exports.down = async (k) => { for (const n of ['activity_log','payments','deliveries','production_updates','bulk_orders','samples','quotations','contact_messages','enquiry_files','enquiries','customers','admin_users']) await k.schema.dropTableIfExists(n); };
