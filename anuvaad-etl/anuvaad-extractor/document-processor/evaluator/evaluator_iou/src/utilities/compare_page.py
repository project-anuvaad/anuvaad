from shapely.geometry import Polygon
from rtree import index


def index_tree(poly_index, poly, idx):
    idx.insert(poly_index, poly.bounds)

def get_polygon(region):
    points = []
    vertices = region['vertices']
    for point in vertices:
        points.append((point['x'], point['y']))
    poly = Polygon(points)
    return poly


def compare_regions(gt_regions, predicted_regions):
    output = []
    lines_intersected = []
    not_intersecting  = []

    idx = index.Index()
    predicted_count =  len(predicted_regions)
    gt_count  =  len(gt_regions)

    base_regions = gt_regions
    compare_regions = predicted_regions
    
    gt_base    = True

    base_exists = len(base_regions) > 0
    if base_exists:
        compare_polys = []
        # initililization of tree index to reduce region query time to log(n)
        for region_idx, region in enumerate(compare_regions):
            poly = get_polygon(region['boundingBox'])
            compare_polys.append(poly)
            idx.insert(region_idx, poly.bounds)
        for base_region in base_regions:
            base_poly = get_polygon(base_region['boundingBox'])
            region_index = list(idx.intersection(base_poly.bounds))
            iou = 0
            intersecting_region = None
            for intr_index in region_index:
                compare_poly = compare_polys[intr_index]
                lines_intersected.append(intr_index)
                check_union = base_poly.union(compare_poly).area != 0
                if check_union :
                    region_iou = base_poly.intersection(compare_poly).area / base_poly.union(compare_poly).area
                else :
                    region_iou =0
                # iou of 0.33 coressponds to 50% overlap
                if (region_iou > iou): #and (region_iou > 0.33):
                    iou = region_iou
                    intersecting_region = compare_regions[intr_index]
            #if gt_base :
            output.append({'ground': base_region, 'input': intersecting_region, 'iou': iou})

        for line_index, line in enumerate(predicted_regions):
            if line_index not in lines_intersected:
                output.append({'ground': None, 'input': line, 'iou': 0})
            # else :
            #     output.append({'ground': intersecting_region, 'input': base_region, 'iou': iou})
        return { 'iou' : output , 'count' : {'input' : predicted_count , 'ground' : gt_count} }
    else:
        return {}























#
# def compare_regions(gt_regions, predicted_regions):
#     output = []
#
#     gt_exists = len(gt_regions) > 0
#     pred_exists = len(predicted_regions) > 0
#     idx = index.Index()
#     if gt_exists:
#         if pred_exists:
#             perd_polys = []
#             for region_idx, region in enumerate(predicted_regions):
#                 poly = get_polygon(region['boundingBox'])
#                 perd_polys.append(poly)
#                 idx.insert(region_idx, poly.bounds)
#             for gt_region in gt_regions:
#                 gt_poly = get_polygon(gt_region['boundingBox'])
#                 region_index = list(idx.intersection(gt_poly.bounds))
#
#                 iou  = 0
#                 intersecting_region = None
#
#                 for intr_index in region_index:
#                     predicted_poly = perd_polys[intr_index]
#                     region_iou = gt_poly.intersection(predicted_poly).area / gt_poly.union(predicted_poly).area
#                     #iou of 0.33 coressponds to 50% overlap
#                     if (region_iou > iou) and (region_iou > 0.33) :
#                         iou = region_iou
#                         intersecting_region = predicted_regions[intr_index]
#
#                 iou = { 'iou' : max(ious) , 'ious' : ious}
#                 output.append({'ground': gt_region, 'input':intersecting_region , 'iou' :iou })
#         else:
#             iou = {'iou': 0, 'ious': [0]}
#             for gt_region in gt_regions:
#                 output.append({'ground': gt_region, 'input': [], 'iou': iou})
#         return output
#     else:
#         return []