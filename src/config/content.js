// Editable site content. No invented specifications, statistics or client names.
const q = 'Developed to your size, design and requirements, subject to feasibility.';
const products = [
 ['corrugated-carton','Corrugated Carton','Corrugated cartons for packing and transport. ','Corrugated'],
 ['press-print-carton','Press Print Carton','Press printed cartons made around your artwork. ','Printed'],
 ['screen-print-carton','Screen Print Carton','Screen printed cartons for your branding needs. ','Printed'],
 ['board-carton','Board Carton','Board cartons for product presentation. ','Board'],
 ['tag-card','Tag Card','Tag cards prepared to your requirements. ','Board'],
 ['bleach-card-box','Bleach Card Box','Bleach card boxes for product packaging. ','Board'],
 ['5-ply-carton','5-Ply Carton','Five-ply corrugated cartons. Suitability is discussed for your product. ','Corrugated'],
 ['3-ply-carton','3-Ply Carton','Three-ply corrugated cartons. Suitability is discussed for your product. ','Corrugated'],
 ['plain-carton','Plain Carton','Plain unprinted cartons in the dimensions you need. ','Corrugated'],
 ['printed-carton','Printed Carton','Printed cartons carrying your brand and information. ','Printed'],
 ['partition-carton','Partition Carton','Cartons with partitions to separate items. ','Custom'],
 ['window-carton','Window Carton','Cartons with a window so the product can be seen. ','Custom'],
].map(([slug,name,desc,cat],i)=>({slug,name,desc,cat,img:`/images/mockups/p-${slug}.webp`,cls:['s7','s5 off','s4','s4 off','s4','s5','s7','s4','s4 off','s4','s7','s5 off'][i]}));
const steps = [
 ['Share Your Requirements','You share dimensions, design, a reference sample, artwork or a packaging idea.','M4 4h16v12H8l-4 4z'],
 ['Requirement Review & Quotation','Our team reviews the specifications and discusses the quotation with you.','M9 12l2 2 4-4M4 4h16v16H4z'],
 ['Physical Sample Development','A physical sample is developed according to the agreed requirements.','M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5'],
 ['Customer Sample Review','You physically check the sample. Revisions can be discussed.','M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z'],
 ['Sample Approval & Order Agreement','You approve the sample, and both parties agree on price, quantity and order terms.','M5 13l4 4L19 7'],
 ['Bulk Production','Production begins after sample approval and agreement on order details.','M3 21V10l6 4V10l6 4V6h6v15z'],
 ['Delivery','The completed order is prepared and delivered according to the agreed arrangements.','M2 6h12v10H2zM14 10h4l3 3v3h-7zM6 18.5h.01M17 18.5h.01'],
].map(([title,text,icon])=>({title,text,icon}));
const why = [
 ['Custom Packaging Discussions','Bring your idea. We discuss what you need and what is feasible.'],
 ['Multiple Carton Options','Corrugated, printed, board, partition and window cartons, and more on request.'],
 ['Requirement-Based Solutions','Packaging is shaped by your requirements, not forced into a fixed catalogue.'],
 ['Physical Sample Review','You handle a real sample before any bulk order is agreed.'],
 ['Customer-Specific Packaging Requirements','Dimensions, printing and features are discussed for your product.'],
].map(([title,text])=>({title,text}));
const requirements = ['Custom dimensions','Different carton structures','Printing requirements','Colour preferences','Product-specific packaging','Partition requirements','Window requirements','Reference samples','New packaging designs'];
const applications = ['Product packing','Shipping and transport','Retail presentation','Wholesale and distribution'];
const gallery = [
 ['Corrugated Cartons','g-corrugated-stack','Stacked corrugated cartons','tall'],['Printed Cartons','g-printed-wide','Printed cartons in three finishes','wide'],
 ['Custom Packaging','g-custom','A custom carton beside its dimension outline','sq'],['Window Cartons','g-window-duo','Window cartons showing the product inside','wide'],
 ['Board Cartons','g-board','Board cartons with printed artwork','sq'],['Partition Cartons','g-partition','Partition carton with divided cells','wide'],
 ['Corrugated Cartons','p-5-ply-carton','Open corrugated carton','wide'],['Board Cartons','g-tags','Tag cards','tall'],
 ['Manufacturing Process',null,'Manufacturing photographs to be supplied','wide'],['Manufacturing Process',null,'Factory photographs to be supplied','sq']];
const galleryCats = ['Corrugated Cartons','Printed Cartons','Custom Packaging','Board Cartons','Partition Cartons','Window Cartons','Manufacturing Process'];
module.exports = { gallery, products, steps, why, requirements, applications, galleryCats };
