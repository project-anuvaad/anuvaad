from itertools import groupby

def arrange_grouped_line_indices(line_connections, debug=False):
    lines          = [list(i) for j, i in groupby(line_connections, lambda a: a[2])]
    if debug:
        print('arrange_grouped_line_indices: %s \n---------\n' % (str(lines)))
        
    arranged_lines = []

    for line_items in lines:
        indices = []
        for line_item in line_items:
            indices.append(line_item[0])
            indices.append(line_item[1])
        indices = sorted(list(set(indices)))
        arranged_lines.append([indices, line_items[0][2]])
        
    if debug:
        print('arrange_grouped_line_indices,arranged_lines : %s \n---------\n' % (str(arranged_lines)))
    
    final_arranged_lines = []
    
    if len(arranged_lines) == 1:
        final_arranged_lines.append([arranged_lines[0][0], arranged_lines[0][1]])
    else:
        for index, line_item in enumerate(arranged_lines):
            if index == 0 and line_item[1] == 'NOT_CONNECTED':
                del line_item[0][-1]
            if index > 0 and index < (len(arranged_lines) - 1) and line_item[1] == 'NOT_CONNECTED':
                del line_item[0][0]
                del line_item[0][-1]
            if index == (len(arranged_lines) - 1) and line_item[1] == 'NOT_CONNECTED':
                del line_item[0][0]

            final_arranged_lines.append([line_item[0], line_item[1]])
    if debug:
        print('final_arrange_grouped_line_indices,arranged_lines : %s \n---------\n' % (str(final_arranged_lines)))
            
    return final_arranged_lines