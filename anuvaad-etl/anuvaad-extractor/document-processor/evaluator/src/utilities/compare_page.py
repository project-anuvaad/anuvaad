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
    gt_exists = len(gt_regions) > 0
    pred_exists = len(predicted_regions) > 0
    idx = index.Index()
    page_iou = []
    page_ious = []

    if gt_exists:

        if pred_exists:
            perd_polys = []

            for region_idx, region in enumerate(predicted_regions):
                poly = get_polygon(region['boundingBox'])
                perd_polys.append(poly)
                idx.insert(region_idx, poly.bounds)

            for gt_region in gt_regions:
                gt_poly = get_polygon(gt_region['boundingBox'])
                region_index = list(idx.intersection(gt_poly.bounds))

                if len(region_index) > 0:
                    ious = []

                    for intr_index in region_index:
                        predicted_poly = perd_polys[intr_index]
                        region_iou = gt_poly.intersection(predicted_poly).area / gt_poly.union(predicted_poly).area
                        ious.append(region_iou)
                    iou = max(ious)
                    page_iou.append(iou)
                    page_ious.append(ious)

        else:
            page_iou = [0] * len(gt_regions)
            page_ious = [[0]] * len(gt_regions)

        return page_iou, page_ious

    else:
        return [], []